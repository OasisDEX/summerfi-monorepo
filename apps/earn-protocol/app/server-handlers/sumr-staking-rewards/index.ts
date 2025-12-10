import { SUMR_CAP, sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import { ChainIds, User } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { cookies } from 'next/headers'
import { type Address } from 'viem'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export interface SumrStakingRewardsData {
  sumrRewardApy: number
  sumrRewardAmount: number
}

// Default diluted valuation from LocalConfigContext
const DEFAULT_DILUTED_VALUATION = '250000000'

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
}: {
  walletAddress: string
}): Promise<SumrStakingRewardsData> => {
  try {
    // Get SUMR price from cookie or use default
    const cookieRaw = await cookies()
    const cookie = cookieRaw.toString()
    const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))

    const dilutedValuation = sumrNetApyConfig?.dilutedValuation || DEFAULT_DILUTED_VALUATION
    const sumrPriceUsd = new BigNumber(dilutedValuation, 10).dividedBy(SUMR_CAP).toNumber()

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
        stakes: userStakes,
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
