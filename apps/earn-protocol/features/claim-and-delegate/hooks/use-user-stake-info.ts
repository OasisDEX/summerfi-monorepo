import { useUserWallet } from '@summerfi/app-earn-ui'
import { useQuery } from '@tanstack/react-query'
import { zeroAddress } from 'viem'

import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { type SumrUserStakeInfoData } from '@/features/claim-and-delegate/types'

const getUserStakeInfo = async (
  walletAddress: string | undefined,
): Promise<SumrUserStakeInfoData> => {
  try {
    const response = await fetch(`/earn/api/sumr-stake-info/${walletAddress}`)

    if (!response.ok) {
      throw new Error('Failed to fetch stake info')
    }

    return response.json()
  } catch (error) {
    throw new Error('Failed to fetch stake info', { cause: error })
  }
}

/**
 * Hook to fetch the SUMR stake info for a given wallet address
 * @returns {Object} Object containing:
 *  - sumrStakeInfo: SUMR stake info data
 *  - isSumrStakeInfoLoading: Loading state indicator
 */
export const useUserStakeInfo = () => {
  const { userWalletAddress } = useUserWallet()
  const { features } = useSystemConfig()
  const stakingV2Enabled = !!features?.StakingV2

  const { data: sumrStakeInfo, isLoading: isSumrStakeInfoLoading } = useQuery({
    queryKey: ['sumr-stake-info', userWalletAddress],
    queryFn: () => getUserStakeInfo(userWalletAddress ?? zeroAddress),
    enabled: !!userWalletAddress && stakingV2Enabled,
  })

  return { sumrStakeInfo, isSumrStakeInfoLoading }
}
