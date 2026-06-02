import { useCallback, useEffect, useState } from 'react'
import { type SdkClient } from '@summerfi/sdk-client-react'
import { type ChainId, type IPrice, RoundState, RoundsVaultType } from '@summerfi/sdk-common'

export type RwaReceiptStatus = 'claimable' | 'cancellable' | 'pending'

/**
 * A single ERC-1155 receipt the user holds for a given rounds-vault round, enriched
 * with the round's state and (when settled) its exchange rate, plus a derived status:
 *  - `claimable`   round is Settled  → claim shares (Input) / assets (Output)
 *  - `cancellable` round is Opened   → cancel the pending deposit/withdraw
 *  - `pending`     round is settling (or not yet open) → no action available
 */
export type RwaReceipt = {
  vaultType: RoundsVaultType
  roundId: bigint
  balance: bigint
  roundState: RoundState
  exchangeRate?: IPrice
  status: RwaReceiptStatus
}

type UseRwaReceiptsProps = {
  // Only fetch when the vault is RWA, the wallet is whitelisted and connected.
  enabled: boolean
  sdk: SdkClient
  fleetAddress: string
  walletAddress?: string
  chainId: number
}

const toStatus = (roundState: RoundState): RwaReceiptStatus => {
  if (roundState === RoundState.Settled) {
    return 'claimable'
  }
  if (roundState === RoundState.Opened) {
    return 'cancellable'
  }

  return 'pending'
}

/**
 * Loads the connected wallet's pending RWA positions: the ERC-1155 receipts held in
 * both the Input (deposits) and Output (redemptions) rounds-vaults, each classified
 * by round state. Exposes `refresh()` so callers can reload after a claim/cancel.
 */
export const useRwaReceipts = ({
  enabled,
  sdk,
  fleetAddress,
  walletAddress,
  chainId,
}: UseRwaReceiptsProps) => {
  const [receipts, setReceipts] = useState<RwaReceipt[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh = useCallback(() => setRefreshCounter((counter) => counter + 1), [])

  useEffect(() => {
    let cancelled = false

    if (!enabled || !walletAddress) {
      setReceipts([])
      setIsLoading(false)

      return () => {
        cancelled = true
      }
    }

    const fetchReceiptsForType = async (vaultType: RoundsVaultType): Promise<RwaReceipt[]> => {
      const balances = await sdk.getRwaReceiptBalances({
        fleetAddress: fleetAddress as `0x${string}`,
        chainId: chainId as ChainId,
        accountAddress: walletAddress as `0x${string}`,
        vaultType,
      })

      const heldBalances = balances.filter((entry) => entry.balance > 0n)

      return Promise.all(
        heldBalances.map(async ({ roundId, balance }) => {
          const roundState = await sdk.getRwaRoundState({
            fleetAddress: fleetAddress as `0x${string}`,
            chainId: chainId as ChainId,
            roundId,
            vaultType,
          })

          const exchangeRate =
            roundState === RoundState.Settled
              ? await sdk
                  .getRwaExchangeRate({
                    fleetAddress: fleetAddress as `0x${string}`,
                    chainId: chainId as ChainId,
                    roundId,
                    vaultType,
                  })
                  .catch(() => undefined)
              : undefined

          return {
            vaultType,
            roundId,
            balance,
            roundState,
            exchangeRate,
            status: toStatus(roundState),
          }
        }),
      )
    }

    const fetchAll = async () => {
      setIsLoading(true)

      try {
        // Fetch both vault types independently so one failing does not hide the other.
        const [input, output] = await Promise.all([
          fetchReceiptsForType(RoundsVaultType.Input).catch(() => [] as RwaReceipt[]),
          fetchReceiptsForType(RoundsVaultType.Output).catch(() => [] as RwaReceipt[]),
        ])

        if (!cancelled) {
          setReceipts([...input, ...output])
        }
      } catch (error) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch RWA receipts', error)
          setReceipts([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchAll()

    return () => {
      cancelled = true
    }
  }, [enabled, sdk, fleetAddress, walletAddress, chainId, refreshCounter])

  return {
    receipts,
    isLoading,
    refresh,
  }
}
