'use client'
import { type SdkClient } from '@summerfi/sdk-client-react'
import { type ChainId } from '@summerfi/sdk-common'
import { useQuery } from '@tanstack/react-query'

type UseRwaVaultMarketValueProps = {
  // Only fetch for RWA (rounds-based) vaults.
  enabled: boolean
  sdk: SdkClient
  fleetAddress: string
  chainId: number
}

// Shared so the open view can invalidate this query after a deposit (which adds to the vault-wide
// pending deposits and therefore the displayed market value).
export const getRwaVaultMarketValueQueryKey = (chainId: number, fleetAddress: string) => [
  'rwa-vault-market-value',
  chainId,
  fleetAddress.toLowerCase(),
]

/**
 * Reads an RWA vault's total market value (true TVL) across all users — Fleet assets plus
 * not-yet-settled pending deposits plus claimable withdrawals. The subgraph `totalValueLockedUSD` /
 * `inputTokenBalance` only reflect the settled Fleet assets, so the open-view "Market Value" stat
 * uses this to include the settling deposits. Vault-wide (no wallet), so it loads for any visitor.
 */
export const useRwaVaultMarketValue = ({
  enabled,
  sdk,
  fleetAddress,
  chainId,
}: UseRwaVaultMarketValueProps) =>
  useQuery({
    queryKey: getRwaVaultMarketValueQueryKey(chainId, fleetAddress),
    queryFn: () =>
      sdk.getRwaVaultMarketValue({
        fleetAddress: fleetAddress.toLowerCase() as `0x${string}`,
        chainId: chainId as ChainId,
      }),
    enabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })
