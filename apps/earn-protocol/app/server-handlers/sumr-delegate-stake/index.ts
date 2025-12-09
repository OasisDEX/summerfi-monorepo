import { SupportedNetworkIds } from '@summerfi/app-types'
import { SummerTokenAbi, SummerVestingWalletFactoryAbi } from '@summerfi/armada-protocol-abis'
import { ChainIds, getChainInfoByChainId, User } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { type Address } from 'viem'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import {
  GOVERNANCE_REWARDS_MANAGER_ADDRESS,
  VESTING_WALLET_FACTORY_ADDRESS,
} from '@/constants/addresses'
import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'

export interface SumrDelegateStakeData {
  delegatedToV1: Address
  delegatedToV2: Address
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
  try {
    const resolvedWalletAddress = walletAddress as Address

    const publicClient = await getSSRPublicClient(SupportedNetworkIds.Base)

    if (!publicClient) {
      throw new Error(`Public client for chain ${SupportedNetworkIds.Base} not found`)
    }

    let sumrToken

    try {
      sumrToken = await backendSDK.armada.users.getSummerToken({
        chainInfo: getChainInfoByChainId(SupportedNetworkIds.Base),
      })
    } catch (error) {
      return serverOnlyErrorHandler(
        'getSummerToken sdk',
        error instanceof Error ? error.message : 'Unknown error',
      )
    }

    try {
      const [sumrAmountResult, delegatedToV2Result, delegatedToV1Result] = await Promise.all([
        backendSDK.armada.users.getUserBalance({
          user: User.createFromEthereum(ChainIds.Base, resolvedWalletAddress),
        }),
        backendSDK.armada.users.getUserDelegateeV2({ userAddress: resolvedWalletAddress }),
        backendSDK.armada.users.getUserDelegatee({
          user: User.createFromEthereum(ChainIds.Base, resolvedWalletAddress),
        }),
      ])

      const _sumrAmount = sumrAmountResult
      const delegatedToV2 = delegatedToV2Result.toSolidityValue()
      const delegatedToV1 = delegatedToV1Result.toSolidityValue()

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!delegatedToV2) {
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
              args: [delegatedToV2],
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
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
        delegatedToV2,
        delegatedToV1,
        delegatedToDecayFactor,
        sumrDelegated,
        stakedAmount,
      }
    } catch (error) {
      return serverOnlyErrorHandler(
        'getSummerToken multicalls',
        error instanceof Error ? error.message : 'Unknown error',
      )
    }
  } catch (error) {
    return serverOnlyErrorHandler(
      'getSummerToken global',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}
