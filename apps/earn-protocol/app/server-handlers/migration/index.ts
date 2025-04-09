import { type SDKChainId, sdkSupportedChains } from '@summerfi/app-types'
import {
  Address,
  type ArmadaMigratablePosition,
  getChainInfoByChainId,
} from '@summerfi/sdk-common/common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { mapMigrationResponse } from '@/features/migration/helpers/map-migration-response'

export type MigratablePosition = ArmadaMigratablePosition & {
  chainId: SDKChainId
  apy: number | undefined
  apy7d: number | undefined
}

/**
 * Fetches migratable positions across all supported chains for a given wallet address.
 *
 * This function:
 * 1. Queries each supported chain in parallel for migratable positions
 * 2. Handles errors gracefully by returning empty positions for failed chain queries
 * 3. Combines and transforms the results into a standardized format
 *
 * @param {Object} params - The function parameters
 * @param {string} params.walletAddress - The Ethereum wallet address to query positions for
 *
 * @returns {Promise<MigratablePosition[]>} A promise that resolves to an array of migratable positions,
 *                                         each enhanced with its corresponding chainId
 */
export const getMigratablePositions = async ({
  walletAddress,
}: {
  walletAddress: string
}): Promise<MigratablePosition[]> => {
  const address = Address.createFromEthereum({ value: walletAddress })

  const positionsPromises = sdkSupportedChains.map(async (chainId) => {
    const chainInfo = getChainInfoByChainId(chainId)
    let positionsData
    let apyData

    try {
      const { user } = await backendSDK.users.getUserClient({
        walletAddress: address,
        chainInfo,
      })

      positionsData = await backendSDK.armada.users.getMigratablePositions({
        user,
        chainInfo,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch migratable positions for chain ${chainId}:`, error)
      positionsData = {
        chainInfo,
        positions: [],
      }
    }

    if (positionsData.positions.length === 0) {
      return {
        positionsData,
        apyData: {
          chainInfo,
          apyByPositionId: {},
        },
      }
    }

    try {
      apyData = await backendSDK.armada.users.getMigratablePositionsApy({
        chainInfo,
        positionIds: positionsData.positions.map((p) => p.id),
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch APY data for chain ${chainId}:`, error)
      apyData = {
        chainInfo,
        apyByPositionId: {},
      }
    }

    return { positionsData, apyData }
  })

  const results = await Promise.all(positionsPromises)

  return mapMigrationResponse(results)
}
