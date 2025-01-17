import { SDKChainId } from '@summerfi/app-types'
import { SummerTokenAbi, SummerVestingWalletFactoryAbi } from '@summerfi/armada-protocol-abis'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { type Address, createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'

export interface SumrDelegateStakeData {
  delegatedTo: Address
  sumrDelegated: string
  stakedAmount: string
}

/**
 * Retrieves SUMR token delegation and staking information for a given wallet address
 * @param {Object} params - The parameters object
 * @param {string} params.walletAddress - The Ethereum wallet address to query
 * @returns {Promise<SumrDelegateStakeData>} Object containing:
 *   - delegatedTo: Address the wallet has delegated voting power to
 *   - sumrDelegated: Total amount of SUMR tokens delegated (includes direct holdings, staked, and vested)
 *   - stakedAmount: Amount of SUMR tokens staked in the rewards manager
 * @throws {Error} If there are issues fetching chain data, token data, or contract data
 */
export const getSumrDelegateStake = async ({
  walletAddress,
}: {
  walletAddress: string
}): Promise<SumrDelegateStakeData> => {
  try {
    const resolvedWalletAddress = walletAddress as Address

    const publicClient = createPublicClient({
      chain: base,
      transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.BASE]),
    })

    let tokens

    try {
      const chainResponse = await backendSDK.chains.getChain({
        chainInfo: getChainInfoByChainId(SDKChainId.BASE),
      })

      // eslint-disable-next-line prefer-destructuring
      tokens = chainResponse.tokens
    } catch (error) {
      throw new Error(
        `Failed to fetch chain data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }

    let sumrToken

    try {
      sumrToken = await tokens.getTokenBySymbol({
        symbol: 'SUMMER',
      })
    } catch (error) {
      throw new Error(
        `Failed to fetch SUMMER token data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }

    try {
      const [
        sumrAmountResult,
        delegatedToResult,
        vestingWalletFactoryResult,
        rewardsManagerResult,
      ] = await publicClient.multicall({
        contracts: [
          {
            abi: SummerTokenAbi,
            address: sumrToken.address.value,
            functionName: 'balanceOf',
            args: [resolvedWalletAddress],
          },
          {
            abi: SummerTokenAbi,
            address: sumrToken.address.value,
            functionName: 'delegates',
            args: [resolvedWalletAddress],
          },
          {
            abi: SummerTokenAbi,
            address: sumrToken.address.value,
            functionName: 'vestingWalletFactory',
            args: [],
          },
          {
            abi: SummerTokenAbi,
            address: sumrToken.address.value,
            functionName: 'rewardsManager',
            args: [],
          },
        ],
      })

      const _sumrAmount = sumrAmountResult.result
      const delegatedTo = delegatedToResult.result
      const verstingWalletFactory = vestingWalletFactoryResult.result
      const rewardsManager = rewardsManagerResult.result

      if (!verstingWalletFactory || !rewardsManager || !delegatedTo) {
        throw new Error('Failed to fetch vesting or staking data or delegated to data')
      }

      // Second multicall
      const [vestingWalletsResult, stakedAmountResult] = await publicClient.multicall({
        contracts: [
          {
            abi: SummerVestingWalletFactoryAbi,
            address: verstingWalletFactory,
            functionName: 'vestingWallets',
            args: [resolvedWalletAddress],
          },
          {
            abi: SummerTokenAbi,
            address: rewardsManager,
            functionName: 'balanceOf',
            args: [resolvedWalletAddress],
          },
        ],
      })

      const vestingWallets = vestingWalletsResult.result
      const _stakedAmount = stakedAmountResult.result

      if (!vestingWallets) {
        throw new Error('Failed to fetch vesting wallets')
      }

      // Third multicall
      const [vestedSumrAmountResult] = await publicClient.multicall({
        contracts: [
          {
            abi: SummerTokenAbi,
            address: sumrToken.address.value,
            functionName: 'balanceOf',
            args: [vestingWallets],
          },
        ],
      })

      const _vestedSumrAmount = vestedSumrAmountResult.result

      if (
        _sumrAmount === undefined ||
        _stakedAmount === undefined ||
        _vestedSumrAmount === undefined
      ) {
        throw new Error('Failed to fetch vesting and staking data')
      }

      const sumrDelegated = new BigNumber(
        (_sumrAmount + _stakedAmount + _vestedSumrAmount).toString(),
      )
        .shiftedBy(-sumrToken.decimals)
        .toString()

      const stakedAmount = new BigNumber(_stakedAmount.toString())
        .shiftedBy(-sumrToken.decimals)
        .toString()

      return {
        delegatedTo,
        sumrDelegated,
        stakedAmount,
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch contract data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getSumrDelegateStake:', error)

    throw new Error(
      `Failed to get SUMR delegate stake: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
