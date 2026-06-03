'use client'

import { type MultipleSourceChartData } from '@summerfi/app-types'
import { useQuery } from '@tanstack/react-query'

import { getInstitutionTvlChartQueryKey } from '@/features/panels/overview/api/institution-overview-query-keys'

const encodeSegment = (value: string) => encodeURIComponent(value)

export const fetchInstitutionTvlChart = async (
  institutionName: string,
): Promise<MultipleSourceChartData | null> => {
  const response = await fetch(`/api/institution/${encodeSegment(institutionName)}/tvl-chart`)

  if (!response.ok) {
    throw new Error(`institution-tvl-chart ${response.status}`)
  }

  return response.json() as Promise<MultipleSourceChartData | null>
}

const sharedQueryOptions = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const

// `enabled` is wired to whether the chart is in the viewport, so the O(n)-per-vault performance
// fetch only fires once the card scrolls into view — then it's cached.
export const useInstitutionTvlChartQuery = (institutionName: string, enabled: boolean) =>
  useQuery({
    queryKey: getInstitutionTvlChartQueryKey(institutionName),
    queryFn: () => fetchInstitutionTvlChart(institutionName),
    enabled,
    ...sharedQueryOptions,
  })
