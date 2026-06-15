import { type AddressValue, type ChainId, RoundState, RoundsVaultType } from '@summerfi/sdk-common'

import { backendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export type RwaReceiptStatus = 'claimable' | 'cancellable' | 'pending'

/**
 * Server-side, JSON-safe representation of a pending RWA position (ERC-1155 receipt). Mirrors the
 * client `RwaReceipt` (see use-rwa-claim), but `roundId`/`balance` are strings so the result can
 * be cached via unstable_cache (JSON.stringify can't serialise BigInt) and crosses to the client.
 */
export type RwaServerReceipt = {
  vaultType: RoundsVaultType
  roundId: string
  balance: string
  roundState: RoundState
  status: RwaReceiptStatus
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
 * Loads the wallet's pending RWA positions for a single fleet: the ERC-1155 receipts held in both
 * the Input (deposits) and Output (redemptions) rounds-vaults, each classified by round state.
 * Reads through {@link backendInstiSDK} (institutional subgraph/headers). Additive to the
 * portfolio, so it degrades to an empty list rather than throwing.
 */
export async function getRwaReceipts({
  chainId,
  fleetAddress,
  walletAddress,
}: {
  chainId: number
  fleetAddress: string
  walletAddress: string
}): Promise<RwaServerReceipt[]> {
  const fetchForType = async (vaultType: RoundsVaultType): Promise<RwaServerReceipt[]> => {
    const balances = await backendInstiSDK.rwa.getReceiptBalances({
      chainId: chainId as ChainId,
      fleetAddress: fleetAddress as AddressValue,
      accountAddress: walletAddress.toLowerCase() as AddressValue,
      vaultType,
    })

    const heldBalances = balances.filter((entry) => entry.balance > 0n)

    return Promise.all(
      heldBalances.map(async ({ roundId, balance }) => {
        const roundState = await backendInstiSDK.rwa.getRoundState({
          chainId: chainId as ChainId,
          fleetAddress: fleetAddress as AddressValue,
          roundId,
          vaultType,
        })

        return {
          vaultType,
          roundId: roundId.toString(),
          balance: balance.toString(),
          roundState,
          status: toStatus(roundState),
        }
      }),
    )
  }

  try {
    // Fetch both vault types independently so one failing does not hide the other.
    const [input, output] = await Promise.all([
      fetchForType(RoundsVaultType.Input).catch(() => [] as RwaServerReceipt[]),
      fetchForType(RoundsVaultType.Output).catch(() => [] as RwaServerReceipt[]),
    ])

    return [...input, ...output]
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getRwaReceipts failed', error)

    return []
  }
}
