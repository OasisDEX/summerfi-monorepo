'use client'

import { useQuery } from '@tanstack/react-query'

import { type PortfolioCoreData } from '@/app/server-handlers/portfolio/get-portfolio-core-data'
import { getPortfolioCoreQueryKey } from '@/features/portfolio/api/portfolio-query-keys'

export type PortfolioCoreResponse = PortfolioCoreData

const sharedQueryOptions = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const

export const fetchPortfolioCore = async (
  walletAddress: string,
): Promise<PortfolioCoreResponse | null> => {
  const response = await fetch(`/earn/api/portfolio/core/${encodeURIComponent(walletAddress)}`)

  if (!response.ok) {
    throw new Error(`portfolio-core ${response.status}`)
  }

  return response.json() as Promise<PortfolioCoreResponse | null>
}

export const usePortfolioCoreDataQuery = (walletAddress: string) =>
  useQuery({
    queryKey: getPortfolioCoreQueryKey(walletAddress),
    queryFn: () => fetchPortfolioCore(walletAddress),
    ...sharedQueryOptions,
  })
