import { SDKChainId } from '@summerfi/app-types'
import { SECONDS_PER_DAY } from '@summerfi/app-utils'
import { GovernanceRewardsManagerAbi, SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { GOVERNANCE_REWARDS_MANAGER_ADDRESS } from '@/constants/addresses'
import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'

export interface SumrStakingInfoData {
  sumrTokenWrappedStakedAmount: number
  sumrTokenDailyEmissionAmount: number
  sumrStakingApy: number
}

/**
 * Fetches SUMR token staking information from the Base network
 * @returns {Promise<SumrStakingInfoData>} Object containing:
 *  - sumrTokenWrappedStakedAmount: Total amount of wrapped SUMR tokens staked
 *  - sumrTokenDailyEmissionAmount: Daily emission rate of SUMR tokens
 *  - sumrStakingApy: Annual percentage yield for SUMR staking
 * @throws {Error} Various errors related to contract interactions or data fetching
 */
export const getSumrStakingInfo = async (): Promise<SumrStakingInfoData> => {
  try {
    const publicClient = await getSSRPublicClient(SDKChainId.BASE)

    if (!publicClient) {
      throw new Error(`Public client for chain ${SDKChainId.BASE} not found`)
    }

    const sumrToken = await backendSDK.armada.users
      .getSummerToken({
        chainInfo: getChainInfoByChainId(SDKChainId.BASE),
      })
      .catch((error) => {
        return serverOnlyErrorHandler(
          'getSummerToken getSumrStakingInfo',
          error instanceof Error ? error.message : 'Unknown error',
        )
      })

    const [wrappedStakingTokenResult, rewardDataResult] = await publicClient
      .multicall({
        contracts: [
          {
            address: GOVERNANCE_REWARDS_MANAGER_ADDRESS,
            abi: GovernanceRewardsManagerAbi,
            functionName: 'wrappedStakingToken',
          },
          {
            address: GOVERNANCE_REWARDS_MANAGER_ADDRESS,
            abi: GovernanceRewardsManagerAbi,
            functionName: 'rewardData',
            args: [sumrToken.address.value],
          },
        ],
      })
      .catch((error) => {
        return serverOnlyErrorHandler(
          'getSummerToken getSumrStakingInfo multicalls',
          error instanceof Error ? error.message : 'Unknown error',
        )
      })

    const wrappedStakingToken = wrappedStakingTokenResult.result
    const rewardData = rewardDataResult.result

    if (wrappedStakingToken === undefined) {
      throw new Error(
        `Failed to fetch wrapped staking token: ${wrappedStakingTokenResult.error.message}`,
      )
    }

    if (rewardData === undefined) {
      throw new Error(`Failed to fetch reward data: ${rewardDataResult.error.message}`)
    }

    const [, rewardRate] = rewardData
    // eslint-disable-next-line no-mixed-operators
    const sumrTokenDailyEmissionAmount = new BigNumber(Number(rewardRate))
      .shiftedBy(-sumrToken.decimals * 2)
      .multipliedBy(SECONDS_PER_DAY)
      .toNumber()

    const _sumrTokenWrappedStakedAmount = await publicClient
      .readContract({
        address: wrappedStakingToken,
        abi: SummerTokenAbi,
        functionName: 'balanceOf',
        args: [GOVERNANCE_REWARDS_MANAGER_ADDRESS],
      })
      .catch((error) => {
        return serverOnlyErrorHandler(
          'getSummerToken getSumrStakingInfo balanceOf',
          error instanceof Error ? error.message : 'Unknown error',
        )
      })

    const sumrTokenWrappedStakedAmount = new BigNumber(_sumrTokenWrappedStakedAmount.toString())
      .shiftedBy(-sumrToken.decimals)
      .toNumber()

    const sumrStakingApy =
      sumrTokenWrappedStakedAmount > 0
        ? (sumrTokenDailyEmissionAmount * 365) / sumrTokenWrappedStakedAmount
        : 0

    return { sumrTokenWrappedStakedAmount, sumrTokenDailyEmissionAmount, sumrStakingApy }
  } catch (error) {
    // Error logging is necessary here for monitoring and debugging
    // eslint-disable-next-line no-console
    console.error('Error in getSumrStakingInfo:', error)

    return { sumrTokenWrappedStakedAmount: 0, sumrTokenDailyEmissionAmount: 0, sumrStakingApy: 0 }
  }
}
