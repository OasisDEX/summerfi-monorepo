import { SDKChainId } from '@summerfi/app-types'
import { GovernanceRewardsManagerAbi } from '@summerfi/armada-protocol-abis'
import BigNumber from 'bignumber.js'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { GOVERNANCE_REWARDS_MANAGER_ADDRESS } from '@/constants/addresses'
import { SDKChainIdToSSRRpcGatewayMap } from '@/helpers/rpc-gateway-ssr'

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
      transport: http(await SDKChainIdToSSRRpcGatewayMap[SDKChainId.BASE]),
    })

    try {
      const callResult = await publicClient.multicall({
        contracts: addresses.map(
          (address) =>
            ({
              abi: GovernanceRewardsManagerAbi,
              address: GOVERNANCE_REWARDS_MANAGER_ADDRESS,
              functionName: 'calculateSmoothedDecayFactor',
              args: [address],
            }) as const,
        ),
      })

      if (!callResult.every((result) => result.status === 'success')) {
        throw new Error('Some decay factor queries failed')
      }

      return addresses.map((address, index) => ({
        address: address.toLowerCase(),
        decayFactor: new BigNumber(callResult[index].result.toString()).shiftedBy(-18).toNumber(),
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
      `Failed to get $SUMR decay factors: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
