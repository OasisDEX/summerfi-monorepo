import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

/**
 * Calculates the total SUMR tokens by summing up various balances and rewards
 * @param rewardsData - Object containing SUMR balances, staking, and reward data
 * @returns The total amount of SUMR tokens as a number
 */
export const calculateOverallSumr = (rewardsData: ClaimDelegateExternalData) => {
  return (
    Number(rewardsData.sumrBalances.total) +
    Number(rewardsData.sumrBalances.vested) +
    Number(rewardsData.sumrStakeDelegate.stakedAmount) +
    Number(rewardsData.sumrToClaim.aggregatedRewards.total)
  )
}
