import { useQuery } from '@tanstack/react-query'

import { type SumrStakingV2AllStakesSlimData } from '@/app/server-handlers/raw-calls/sumr-staking-v2/types'

type SumrStakingV2AllStakesResponse = {
  allStakes: SumrStakingV2AllStakesSlimData
}

export const getSumrStakingV2AllStakesData = async (): Promise<SumrStakingV2AllStakesResponse> => {
  const response = await fetch('/earn/api/staking-v2/all-stakes')

  if (!response.ok) {
    throw new Error(`sumr-staking-v2-all-stakes-data ${response.status}`)
  }

  return response.json() as Promise<SumrStakingV2AllStakesResponse>
}

export const useSumrStakingV2AllStakesDataQuery = () => {
  return useQuery({
    queryKey: ['sumr-staking-v2-all-stakes-data'],
    queryFn: getSumrStakingV2AllStakesData,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
}
