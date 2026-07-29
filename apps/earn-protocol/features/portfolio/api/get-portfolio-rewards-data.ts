import { useQuery } from '@tanstack/react-query'

import { type PortfolioSumrStakingV2Data } from '@/app/server-handlers/raw-calls/sumr-staking-v2/types'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { type ClaimableRewards, type UsdcAirdropClaimable } from '@/features/portfolio/types'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

type PortfolioRewardsResponse = {
  rewardsData: ClaimDelegateExternalData
  portfolioSumrStakingV2Data: PortfolioSumrStakingV2Data
  claimableRewards: ClaimableRewards
  usdcAirdrop: UsdcAirdropClaimable | null
}

export const getPortfolioRewardsData = async (
  walletAddress: string,
): Promise<PortfolioRewardsResponse> => {
  const response = await fetch(`/earn/api/portfolio/rewards/${walletAddress}`)

  if (!response.ok) {
    throw new Error(`portfolio-rewards-data ${response.status}`)
  }

  return response.json() as Promise<PortfolioRewardsResponse>
}

export const usePortfolioRewardsDataQuery = (walletAddress: string) => {
  return useQuery({
    queryKey: [
      'portfolio-rewards-data',
      walletAddress.toLowerCase(),
      getUserDataCacheHandler(walletAddress),
    ],
    queryFn: () => getPortfolioRewardsData(walletAddress),
    enabled: Boolean(walletAddress),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
}
