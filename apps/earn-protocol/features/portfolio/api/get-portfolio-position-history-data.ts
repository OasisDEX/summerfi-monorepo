'use client'

import { type SingleSourceChartData, type SupportedSDKNetworks } from '@summerfi/app-types'
import { useQuery } from '@tanstack/react-query'

import { getPortfolioPositionHistoryQueryKey } from '@/features/portfolio/api/portfolio-query-keys'

const encodeSegment = (value: string) => encodeURIComponent(value)

export const fetchPortfolioPositionHistory = async (
  walletAddress: string,
  network: SupportedSDKNetworks,
  vaultId: string,
): Promise<SingleSourceChartData | null> => {
  const response = await fetch(
    `/earn/api/portfolio/position-history/${encodeSegment(walletAddress)}/${encodeSegment(network)}/${encodeSegment(vaultId)}`,
  )

  if (!response.ok) {
    throw new Error(`portfolio-position-history ${response.status}`)
  }

  return response.json() as Promise<SingleSourceChartData | null>
}

const sharedQueryOptions = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const

// `enabled` is wired to whether the position card is in the viewport, so the (heavy) per-vault
// position-history call only fires once the card scrolls into view — then it's cached.
export const usePortfolioPositionHistoryQuery = (
  walletAddress: string,
  network: SupportedSDKNetworks,
  vaultId: string,
  enabled: boolean,
) =>
  useQuery({
    queryKey: getPortfolioPositionHistoryQueryKey(walletAddress, network, vaultId),
    queryFn: () => fetchPortfolioPositionHistory(walletAddress, network, vaultId),
    enabled,
    ...sharedQueryOptions,
  })
