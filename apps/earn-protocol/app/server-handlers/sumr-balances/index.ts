import { SDKChainId } from '@summerfi/app-types'
import { SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { type Address, createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'

export interface SumrBalancesData {
  ethereum: string
  arbitrum: string
  base: string
  total: string
}

/**
 * Fetches SUMR token balances across different chains for a given wallet address
 * @param {Object} params - The parameters object
 * @param {string} params.walletAddress - The wallet address to check balances for
 * @returns {Promise<SumrBalancesData>} Object containing SUMR balances for each chain and total
 * @throws {Error} If there's an error fetching the balances
 */
export const getSumrBalances = async ({
  walletAddress,
}: {
  walletAddress: string
}): Promise<SumrBalancesData> => {
  try {
    const resolvedWalletAddress = walletAddress as Address

    const chainConfigs = [
      { chain: base, chainId: SDKChainId.BASE },
      // TODO uncomment once SUMR token will be deploy on networks below
      //   { chain: mainnet, chainId: SDKChainId.MAINNET },
      //   { chain: arbitrum, chainId: SDKChainId.ARBITRUM },
      //   { chain: optimism, chainId: SDKChainId.OPTIMISM },
    ]

    const balances = await Promise.all(
      chainConfigs.map(async ({ chain, chainId }) => {
        const publicClient = createPublicClient({
          chain,
          transport: http(SDKChainIdToRpcGatewayMap[chainId]),
        })

        try {
          const chainResponse = await backendSDK.chains.getChain({
            chainInfo: getChainInfoByChainId(chainId),
          })

          const sumrToken = await chainResponse.tokens
            .getTokenBySymbol({
              symbol: 'SUMMER',
            })
            .catch(() => null)

          if (!sumrToken) {
            // Token not available on this network
            return {
              chain: chain.name.toLowerCase(),
              balance: '0',
            }
          }

          const balanceResult = await publicClient.readContract({
            abi: SummerTokenAbi,
            address: sumrToken.address.value,
            functionName: 'balanceOf',
            args: [resolvedWalletAddress],
          })

          if (balanceResult === undefined) {
            return {
              chain: chain.name.toLowerCase(),
              balance: '0',
            }
          }

          return {
            chain: chain.name.toLowerCase(),
            balance: new BigNumber(balanceResult.toString())
              .shiftedBy(-sumrToken.decimals)
              .toString(),
          }
        } catch (error) {
          // Log the error but don't throw, return 0 balance instead
          // eslint-disable-next-line no-console
          console.error(`Error fetching balance for ${chain.name}:`, error)

          return {
            chain: chain.name.toLowerCase(),
            balance: '0',
          }
        }
      }),
    )

    const result = {
      ethereum: '0',
      arbitrum: '0',
      base: '0',
      total: '0',
    }

    const total = balances.reduce((acc, { balance }) => acc.plus(balance), new BigNumber(0))

    balances.forEach(({ chain, balance }) => {
      result[chain as keyof Omit<SumrBalancesData, 'total'>] = balance
    })

    return {
      ...result,
      total: total.toString(),
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getSumrBalances:', error)

    throw new Error(
      `Failed to get SUMR balances: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
