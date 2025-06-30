import { SDKChainId } from '@summerfi/app-types'
import { GovernanceRewardsManagerAbi } from '@summerfi/armada-protocol-abis'
import BigNumber from 'bignumber.js'

import { getSSRPublicClient } from '@summerfi/ssr-public-client'
import { Logger } from '@aws-lambda-powertools/logger'

// Governance Rewards Manager address on Base
export const GOVERNANCE_REWARDS_MANAGER_ADDRESS = '0xDe61A0a49f48e108079bdE73caeA56E87FfeEF92'

// Batch size for multicall to avoid gas limit issues
const BATCH_SIZE = 10

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
export const getSumrDecayFactor = async (
  addresses: string[],
  logger: Logger,
): Promise<SumrDecayFactorData[]> => {
  try {
    if (!addresses.length) {
      return []
    }

    const publicClient = await getSSRPublicClient(SDKChainId.BASE)

    if (!publicClient) {
      throw new Error(`Public client for chain ${SDKChainId.BASE} not found`)
    }

    const results: SumrDecayFactorData[] = []

    let isFirstRequest = true
    // Process addresses in batches of BATCH_SIZE
    for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
      const batch = addresses.slice(i, i + BATCH_SIZE)

      if (!isFirstRequest) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      isFirstRequest = false

      try {
        const callResult = await publicClient.multicall({
          contracts: batch.map(
            (address) =>
              ({
                abi: GovernanceRewardsManagerAbi,
                address: GOVERNANCE_REWARDS_MANAGER_ADDRESS,
                functionName: 'calculateSmoothedDecayFactor',
                args: [address],
              }) as const,
          ),
        })

        logger.info(
          `Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(addresses.length / BATCH_SIZE)} processed`,
          {
            batchSize: batch.length,
            successCount: callResult.filter((r) => r.status === 'success').length,
            failureCount: callResult.filter((r) => r.status === 'failure').length,
          },
        )

        if (!callResult.every((result) => result.status === 'success')) {
          logger.warn(
            `Some decay factor queries failed in batch ${Math.floor(i / BATCH_SIZE) + 1}`,
            {
              failedAddresses: batch.filter((_, index) => callResult[index].status === 'failure'),
            },
          )
        }

        // Process batch results
        batch.forEach((address, index) => {
          const result = callResult[index]
          if (result?.status === 'success' && result.result) {
            results.push({
              address: address.toLowerCase(),
              decayFactor: new BigNumber(result.result.toString()).shiftedBy(-18).toNumber(),
            })
          } else {
            // Add with default value of 0
            results.push({
              address: address.toLowerCase(),
              decayFactor: 0,
            })
          }
        })
      } catch (error) {
        logger.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          addresses: batch,
        })
        // Add default values for failed batch
        batch.forEach((address) => {
          results.push({
            address: address.toLowerCase(),
            decayFactor: 0,
          })
        })
      }
    }

    return results
  } catch (error) {
    logger.error('getSumrDecayFactor global', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return []
  }
}
