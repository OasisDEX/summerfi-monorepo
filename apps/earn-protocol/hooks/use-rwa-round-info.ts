import { useEffect, useState } from 'react'
import { type SdkClient } from '@summerfi/sdk-client-react'
import { type ChainId, type RoundState, RoundsVaultType } from '@summerfi/sdk-common'

type UseRwaRoundInfoProps = {
  // Only fetch when the vault is RWA and the round context is relevant
  // (e.g. a whitelisted wallet is connected).
  enabled: boolean
  sdk: SdkClient
  fleetAddress: string
  chainId: number
  // Deposits enter the Input rounds-vault; withdrawals the Output one.
  vaultType?: RoundsVaultType
}

/**
 * Fetches the current round context for an RWA (rounds-based) vault: the current
 * round id, its state (NotOpened / Opened / InSettlement / Settled) and the
 * round exchange rate. Used to tell the user which round a deposit enters and to
 * block deposits when the round is not currently accepting them.
 */
export const useRwaRoundInfo = ({
  enabled,
  sdk,
  fleetAddress,
  chainId,
  vaultType = RoundsVaultType.Input,
}: UseRwaRoundInfoProps) => {
  const [roundId, setRoundId] = useState<bigint | undefined>(undefined)
  const [roundState, setRoundState] = useState<RoundState | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!enabled) {
      setRoundId(undefined)
      setRoundState(undefined)
      setIsLoading(false)

      return () => {
        cancelled = true
      }
    }

    const fetchRoundInfo = async () => {
      setIsLoading(true)

      try {
        const currentRound = await sdk.getRwaCurrentRound({
          fleetAddress: fleetAddress as `0x${string}`,
          chainId: chainId as ChainId,
          vaultType,
        })

        const [state] = await Promise.all([
          sdk.getRwaRoundState({
            fleetAddress: fleetAddress as `0x${string}`,
            chainId: chainId as ChainId,
            roundId: currentRound,
            vaultType,
          }),
        ])

        if (!cancelled) {
          setRoundId(currentRound)
          setRoundState(state)
        }
      } catch (error) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch RWA round info', error)
          setRoundId(undefined)
          setRoundState(undefined)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchRoundInfo()

    return () => {
      cancelled = true
    }
  }, [enabled, sdk, fleetAddress, chainId, vaultType])

  return {
    roundId,
    roundState,
    isLoading,
  }
}
