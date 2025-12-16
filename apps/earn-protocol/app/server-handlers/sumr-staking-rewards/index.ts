import { SUMR_CAP } from '@summerfi/app-earn-ui'
import { ChainIds, User } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { type Address } from 'viem'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { defaultSumrMarketCap } from '@/helpers/sumr-market-cap'

export interface SumrStakingRewardsData {
  sumrRewardApy: number
  sumrRewardAmount: number
}

/**
 * Fetches SUMR staking rewards data for a given wallet address
 * @param {Object} params - The parameters object
 * @param {string} params.walletAddress - The Ethereum wallet address to query
 * @returns {Promise<SumrStakingRewardsData>} Object containing:
 *  - sumrRewardApy: Annual percentage yield for SUMR rewards
 *  - sumrRewardAmount: Estimated SUMR rewards amount per year
 * @throws {Error} Various errors related to SDK interactions or data fetching
 */
export const getSumrStakingRewards = async ({
  walletAddress,
  dilutedValuation,
}: {
  walletAddress: string
  dilutedValuation?: string
}): Promise<SumrStakingRewardsData> => {
  try {
    const sumrPriceUsd = new BigNumber(dilutedValuation ?? defaultSumrMarketCap, 10)
      .dividedBy(SUMR_CAP)
      .toNumber()

    const user = User.createFromEthereum(ChainIds.Base, walletAddress as Address)

    // Fetch reward rates and user stakes in parallel
    const [rewardRates, userStakes] = await Promise.all([
      backendSDK.armada.users.getStakingRewardRatesV2({ sumrPriceUsd }),
      backendSDK.armada.users.getUserStakesV2({ user }),
    ])

    const sumrRewardApy = rewardRates.summerRewardYield.value

    let sumrRewardAmount = 0

    // Calculate earnings estimation if user has stakes
    if (userStakes.length > 0) {
      const earningsEstimation = await backendSDK.armada.users.getStakingEarningsEstimationV2({
        stakes: userStakes.map((stake) => ({
          id: stake.id,
          weightedAmount: stake.weightedAmount.toString(),
        })),
      })

      sumrRewardAmount = earningsEstimation.stakes.reduce(
        (acc, stake) => acc + parseFloat(stake.sumrRewardsAmount.toString()),
        0,
      )
    }

    return { sumrRewardApy, sumrRewardAmount }
  } catch (error) {
    // Error logging is necessary here for monitoring and debugging
    // eslint-disable-next-line no-console
    console.error('Error in getSumrStakingRewards:', error)

    return { sumrRewardApy: 0, sumrRewardAmount: 0 }
  }
}
