import { SDKChainId } from '@summerfi/app-types'
import { SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'

export interface SumrDecayFactorData {
  address: string
  decayFactor: number
}

/**
 * Fetches decay factors for SUMMER token holders
 * @param addresses Array of wallet addresses to check decay factors for
 * @returns Array of objects containing address and its corresponding decay factor
 *
 * The decay factor represents the token holder's voting power, if 1 is the maximum
 * voting power,  0.5 is half the voting power etc.
 */
export const getSumrDecayFactor = async (addresses: string[]): Promise<SumrDecayFactorData[]> => {
  try {
    if (!addresses.length) {
      return []
    }

    const publicClient = createPublicClient({
      chain: base,
      transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.BASE]),
    })

    let sumrToken

    try {
      const chainResponse = await backendSDK.chains.getChain({
        chainInfo: getChainInfoByChainId(SDKChainId.BASE),
      })

      sumrToken = await chainResponse.tokens.getTokenBySymbol({
        symbol: 'SUMMER',
      })
    } catch (error) {
      throw new Error(
        `Failed to fetch SUMMER token data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }

    try {
      const decayFactors = await publicClient.multicall({
        contracts: addresses.map(
          (address) =>
            ({
              abi: SummerTokenAbi,
              address: sumrToken.address.value,
              functionName: 'getDecayFactor',
              args: [address],
            }) as const,
        ),
      })

      if (!decayFactors.every((result) => result.status === 'success')) {
        throw new Error('Some decay factor queries failed')
      }

      return addresses.map((address, index) => ({
        address: address.toLowerCase(),
        decayFactor: new BigNumber(decayFactors[index].result.toString() ?? '0')
          .shiftedBy(-sumrToken.decimals)
          .toNumber(),
      }))
    } catch (error) {
      throw new Error(
        `Failed to fetch decay factors: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getSumrDecayFactor:', error)

    throw new Error(
      `Failed to get SUMR decay factors: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
