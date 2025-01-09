import { SDKChainId } from '@summerfi/app-types'
import { SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { type Address, createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'
import { sumrDelegates } from '@/features/claim-and-delegate/consts'

/**
 * Fetches the voting power for all SUMMER token delegates on the Base network using multicall.
 *
 * @returns {Promise<Array<{delegate: string, amountOfVotes: string}>>} An array of objects containing:
 *   - delegate: The delegate's address
 *   - amountOfVotes: The amount of voting power for the delegate (formatted with decimals)
 *
 * @throws {Error} If there's an issue connecting to the RPC or fetching token information
 */
export const getDelegatesVotes = async () => {
  try {
    const publicClient = createPublicClient({
      chain: base,
      transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.BASE]),
    })

    const { tokens } = await backendSDK.chains.getChain({
      chainInfo: getChainInfoByChainId(SDKChainId.BASE),
    })

    const sumrToken = await tokens.getTokenBySymbol({
      symbol: 'SUMMER',
    })

    if (!sumrToken.address.value) {
      throw new Error('SUMMER token address not found')
    }

    let multicallResults

    try {
      multicallResults = await publicClient.multicall({
        contracts: sumrDelegates.map(
          (delegate) =>
            ({
              abi: SummerTokenAbi,
              address: sumrToken.address.value,
              functionName: 'getVotes',
              args: [delegate.address as Address],
            }) as const,
        ),
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching delegate votes via multicall:', error)

      // Return zero votes for all delegates if multicall fails
      return sumrDelegates.map((delegate) => ({
        delegate: delegate.address,
        amountOfVotes: '0',
      }))
    }

    return sumrDelegates.map((delegate, index) => {
      const result = multicallResults[index]

      return {
        delegate: delegate.address,
        amountOfVotes:
          result.status === 'success'
            ? new BigNumber(result.result.toString()).shiftedBy(-sumrToken.decimals).toString()
            : '0',
      }
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in getDelegatesVotes:', error)

    throw error
  }
}
