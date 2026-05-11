import { useQuery } from '@tanstack/react-query'

import { type PortfolioAssetsResponse } from '@/app/server-handlers/cached/get-wallet-assets/types'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

type PortfolioWalletResponse = {
  walletData: PortfolioAssetsResponse
  error: boolean
}

export const getPortfolioWalletData = async (
  walletAddress: string,
): Promise<PortfolioWalletResponse> => {
  const response = await fetch(`/earn/api/portfolio/wallet/${walletAddress}`)

  if (!response.ok) {
    throw new Error(`portfolio-wallet-data ${response.status}`)
  }

  return response.json() as Promise<PortfolioWalletResponse>
}

export const usePortfolioWalletDataQuery = (walletAddress: string) => {
  return useQuery({
    queryKey: [
      'portfolio-wallet-data',
      walletAddress.toLowerCase(),
      getUserDataCacheHandler(walletAddress),
    ],
    queryFn: () => getPortfolioWalletData(walletAddress),
    enabled: Boolean(walletAddress),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
}
