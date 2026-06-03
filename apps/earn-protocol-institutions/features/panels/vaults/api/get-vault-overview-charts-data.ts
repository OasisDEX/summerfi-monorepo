'use client'

import { useQuery } from '@tanstack/react-query'

import { type VaultOverviewChartsData } from '@/app/server-handlers/institution/get-vault-overview-charts-data'
import { getVaultOverviewChartsQueryKey } from '@/features/panels/vaults/api/vault-overview-query-keys'

const encodeSegment = (value: string) => encodeURIComponent(value)

export const fetchVaultOverviewCharts = async (
  institutionName: string,
  network: string,
  vaultAddress: string,
): Promise<VaultOverviewChartsData | null> => {
  const response = await fetch(
    `/api/institution/${encodeSegment(institutionName)}/vault/${encodeSegment(network)}/${encodeSegment(vaultAddress)}/overview-charts`,
  )

  if (!response.ok) {
    throw new Error(`vault-overview-charts ${response.status}`)
  }

  return response.json() as Promise<VaultOverviewChartsData | null>
}

const sharedQueryOptions = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const

// `enabled` is wired to whether the performance section is in view, so the four heavy chart
// fetches only fire once it scrolls into view — then the result is cached.
export const useVaultOverviewChartsQuery = (
  institutionName: string,
  network: string,
  vaultAddress: string,
  enabled: boolean,
) =>
  useQuery({
    queryKey: getVaultOverviewChartsQueryKey(institutionName, network, vaultAddress),
    queryFn: () => fetchVaultOverviewCharts(institutionName, network, vaultAddress),
    enabled,
    ...sharedQueryOptions,
  })
