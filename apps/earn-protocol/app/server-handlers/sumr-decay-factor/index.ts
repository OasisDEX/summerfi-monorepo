import { SDKChainId } from '@summerfi/app-types'
import { GovernanceRewardsManagerAbi } from '@summerfi/armada-protocol-abis'
import BigNumber from 'bignumber.js'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { GOVERNANCE_REWARDS_MANAGER_ADDRESS } from '@/constants/addresses'
import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'

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

    const publicClient = await getSSRPublicClient(SDKChainId.BASE)

    if (!publicClient) {
      throw new Error(`Public client for chain ${SDKChainId.BASE} not found`)
    }

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
      return serverOnlyErrorHandler(
        'getSumrDecayFactor multicall',
        error instanceof Error ? error.message : 'Unknown error',
      )
    }
  } catch (error) {
    return serverOnlyErrorHandler(
      'getSumrDecayFactor global',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}
