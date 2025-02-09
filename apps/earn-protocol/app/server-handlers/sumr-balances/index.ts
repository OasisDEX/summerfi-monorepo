import { SDKChainId } from '@summerfi/app-types'
import { SummerTokenAbi, SummerVestingWalletFactoryAbi } from '@summerfi/armada-protocol-abis'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { unstable_cache as unstableCache } from 'next/cache'
import { type Address, createPublicClient, http, zeroAddress } from 'viem'
import { arbitrum, base, mainnet } from 'viem/chains'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { VESTING_WALLET_FACTORY_ADDRESS } from '@/constants/addresses'
import { REVALIDATION_TIMES } from '@/constants/revalidations'
import { SDKChainIdToSSRRpcGatewayMap } from '@/helpers/rpc-gateway-ssr'

export interface SumrBalancesData {
  mainnet: string
  arbitrum: string
  base: string
  total: string // without vesting
  vested: string
  raw: {
    mainnet: string
    arbitrum: string
    base: string
    total: string
    vested: string
  }
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
      { chain: base, chainId: SDKChainId.BASE, chainName: 'base' },
      { chain: mainnet, chainId: SDKChainId.MAINNET, chainName: 'mainnet' },
      { chain: arbitrum, chainId: SDKChainId.ARBITRUM, chainName: 'arbitrum' },
    ]

    const balances = await Promise.all(
      chainConfigs.map(
        unstableCache(
          async ({ chain, chainId, chainName }) => {
            const publicClient = createPublicClient({
              chain,
              transport: http(await SDKChainIdToSSRRpcGatewayMap[chainId]),
            })

            try {
              const sumrToken = await backendSDK.armada.users.getSummerToken({
                chainInfo: getChainInfoByChainId(chainId),
              })

              if (
                !sumrToken ||
                sumrToken.address.value.toLowerCase() === zeroAddress.toLowerCase()
              ) {
                // Token not available on this network
                return {
                  chain: chainName,
                  balance: '0',
                  rawBalance: '0',
                }
              }

              const balanceResult = await publicClient.readContract({
                abi: SummerTokenAbi,
                address: sumrToken.address.value,
                functionName: 'balanceOf',
                args: [resolvedWalletAddress],
              })

              let vestingBalanceOnBase = 0n

              if (chainId === SDKChainId.BASE) {
                const vestingWallet = await publicClient.readContract({
                  abi: SummerVestingWalletFactoryAbi,
                  address: VESTING_WALLET_FACTORY_ADDRESS,
                  functionName: 'vestingWallets',
                  args: [resolvedWalletAddress],
                })

                vestingBalanceOnBase = await publicClient.readContract({
                  abi: SummerTokenAbi,
                  address: sumrToken.address.value,
                  functionName: 'balanceOf',
                  args: [vestingWallet],
                })
              }

              if (balanceResult === undefined) {
                return {
                  chain: chainName,
                  balance: '0',
                  rawBalance: '0',
                }
              }

              return {
                chain: chainName,
                balance: new BigNumber(balanceResult.toString())
                  .shiftedBy(-sumrToken.decimals)
                  .toString(),
                rawBalance: balanceResult.toString(),
                vestingBalance: new BigNumber(vestingBalanceOnBase.toString())
                  .shiftedBy(-sumrToken.decimals)
                  .toString(),
                vestingRawBalance: vestingBalanceOnBase.toString(),
              }
            } catch (error) {
              // Log the error but don't throw, return 0 balance instead
              // eslint-disable-next-line no-console
              console.error(`Error fetching balance for ${chain.name}:`, error)

              return {
                chain: chainName,
                balance: '0',
                rawBalance: '0',
              }
            }
          },
          [walletAddress],
          {
            revalidate: REVALIDATION_TIMES.PORTFOLIO_DATA,
            tags: [walletAddress.toLowerCase()],
          },
        ),
      ),
    )

    const result = {
      mainnet: '0',
      arbitrum: '0',
      base: '0',
      total: '0',
      vested: '0',
      raw: {
        mainnet: '0',
        arbitrum: '0',
        base: '0',
        total: '0',
        vested: '0',
      },
    }

    const total = balances.reduce((acc, { balance }) => acc.plus(balance), new BigNumber(0))
    const rawTotal = balances.reduce(
      (acc, { rawBalance }) => acc.plus(rawBalance),
      new BigNumber(0),
    )

    balances.forEach(({ chain, balance, rawBalance }) => {
      result[chain as keyof Omit<SumrBalancesData, 'total' | 'raw'>] = balance
      result.raw[chain as keyof Omit<typeof result.raw, 'total'>] = rawBalance
    })

    return {
      ...result,
      total: total.toString(),
      vested: balances.find((b) => b.chain === 'base')?.vestingBalance ?? '0',
      raw: {
        ...result.raw,
        total: rawTotal.toString(),
        vested: balances.find((b) => b.chain === 'base')?.vestingRawBalance ?? '0',
      },
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getSumrBalances:', error)

    throw new Error(
      `Failed to get SUMR balances: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
