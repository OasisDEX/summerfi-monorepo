import { SDKChainId } from '@summerfi/app-types'
import { SECONDS_PER_DAY } from '@summerfi/app-utils'
import { GovernanceRewardsManagerAbi, SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'

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
    const publicClient = createPublicClient({
      chain: base,
      transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.BASE]),
    })

    const chainResponse = await backendSDK.chains
      .getChain({
        chainInfo: getChainInfoByChainId(SDKChainId.BASE),
      })
      .catch((error) => {
        throw new Error(`Failed to get chain info: ${error.message}`)
      })

    const { tokens } = chainResponse

    const sumrToken = await tokens
      .getTokenBySymbol({
        symbol: 'SUMMER',
      })
      .catch((error) => {
        throw new Error(`Failed to get SUMMER token: ${error.message}`)
      })

    const rewardsManager = await publicClient
      .readContract({
        address: sumrToken.address.value,
        abi: SummerTokenAbi,
        functionName: 'rewardsManager',
      })
      .catch((error) => {
        throw new Error(`Failed to read rewardsManager: ${error.message}`)
      })

    const [wrappedStakingTokenResult, rewardDataResult] = await publicClient
      .multicall({
        contracts: [
          {
            address: rewardsManager,
            abi: GovernanceRewardsManagerAbi,
            functionName: 'wrappedStakingToken',
          },
          {
            address: rewardsManager,
            abi: GovernanceRewardsManagerAbi,
            functionName: 'rewardData',
            args: [sumrToken.address.value],
          },
        ],
      })
      .catch((error) => {
        throw new Error(`Failed to fetch staking data: ${error.message}`)
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
      .shiftedBy(-sumrToken.decimals)
      .multipliedBy(SECONDS_PER_DAY)
      .toNumber()

    const _sumrTokenWrappedStakedAmount = await publicClient
      .readContract({
        address: wrappedStakingToken,
        abi: SummerTokenAbi,
        functionName: 'balanceOf',
        args: [rewardsManager],
      })
      .catch((error) => {
        throw new Error(`Failed to read wrapped staked SUMR balance: ${error.message}`)
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
