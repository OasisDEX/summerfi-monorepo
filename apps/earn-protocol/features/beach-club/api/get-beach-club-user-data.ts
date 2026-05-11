import { useQuery } from '@tanstack/react-query'

import { type BeachClubData } from '@/app/server-handlers/raw-calls/beach-club/types'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getBeachClubUserData = async (walletAddress: string): Promise<BeachClubData> => {
  const response = await fetch(`/earn/api/beach-club/user-data/${walletAddress}`)

  if (!response.ok) {
    throw new Error(`beach-club-user-data ${response.status}`)
  }

  return response.json() as Promise<BeachClubData>
}

export const useBeachClubUserDataQuery = (walletAddress: string) => {
  return useQuery({
    queryKey: [
      'beach-club-user-data',
      walletAddress.toLowerCase(),
      getUserDataCacheHandler(walletAddress),
    ],
    queryFn: () => getBeachClubUserData(walletAddress),
    enabled: Boolean(walletAddress),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
}
