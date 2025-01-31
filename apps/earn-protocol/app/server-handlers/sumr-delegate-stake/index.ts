import { SDKChainId } from '@summerfi/app-types'
import { SummerTokenAbi, SummerVestingWalletFactoryAbi } from '@summerfi/armada-protocol-abis'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { unstable_cache as unstableCache } from 'next/cache'
import { type Address, createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import {
  GOVERNANCE_REWARDS_MANAGER_ADDRESS,
  VESTING_WALLET_FACTORY_ADDRESS,
} from '@/constants/addresses'
import { REVALIDATION_TIMES } from '@/constants/revalidations'
import { SDKChainIdToSSRRpcGatewayMap } from '@/helpers/rpc-gateway-ssr'

export interface SumrDelegateStakeData {
  delegatedTo: Address
  delegatedToDecayFactor: number
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
 *   - delegatedToDecayFactor: Decay factor for the delegated SUMR tokens
 * @throws {Error} If there are issues fetching chain data, token data, or contract data
 */
export const getSumrDelegateStake = async ({
  walletAddress,
}: {
  walletAddress: string
}): Promise<SumrDelegateStakeData> => {
  return await unstableCache(
    async () => {
      try {
        const resolvedWalletAddress = walletAddress as Address

        const publicClient = createPublicClient({
          chain: base,
          transport: http(await SDKChainIdToSSRRpcGatewayMap[SDKChainId.BASE]),
        })

        let sumrToken

        try {
          sumrToken = await backendSDK.armada.users.getSummerToken({
            chainInfo: getChainInfoByChainId(SDKChainId.BASE),
          })
        } catch (error) {
          throw new Error(
            `Failed to fetch SUMMER token data: ${error instanceof Error ? error.message : 'Unknown error'}`,
          )
        }

        try {
          const [sumrAmountResult, delegatedToResult] = await publicClient.multicall({
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
            ],
          })

          const _sumrAmount = sumrAmountResult.result
          const delegatedTo = delegatedToResult.result

          if (!delegatedTo) {
            throw new Error('Failed to fetch vesting or staking data or delegated to data')
          }

          // Second multicall
          const [vestingWalletsResult, stakedAmountResult, decayFactorResult] =
            await publicClient.multicall({
              contracts: [
                {
                  abi: SummerVestingWalletFactoryAbi,
                  address: VESTING_WALLET_FACTORY_ADDRESS,
                  functionName: 'vestingWallets',
                  args: [resolvedWalletAddress],
                },
                {
                  abi: SummerTokenAbi,
                  address: GOVERNANCE_REWARDS_MANAGER_ADDRESS,
                  functionName: 'balanceOf',
                  args: [resolvedWalletAddress],
                },
                {
                  abi: SummerTokenAbi,
                  address: sumrToken.address.value,
                  functionName: 'getDecayFactor',
                  args: [delegatedTo],
                },
              ],
            })

          const vestingWallets = vestingWalletsResult.result
          const _stakedAmount = stakedAmountResult.result
          const decayFactor = decayFactorResult.result

          if (!vestingWallets) {
            throw new Error('Failed to fetch vesting wallets')
          }
          if (decayFactor === undefined) {
            throw new Error('Failed to fetch decay factor')
          }

          const delegatedToDecayFactor = new BigNumber(decayFactor.toString())
            .shiftedBy(-sumrToken.decimals)
            .toNumber()

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
            delegatedToDecayFactor,
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
    },
    ['walletAddress'],
    {
      revalidate: REVALIDATION_TIMES.PORTFOLIO_DATA,
      tags: [walletAddress.toLowerCase()],
    },
  )()
}
