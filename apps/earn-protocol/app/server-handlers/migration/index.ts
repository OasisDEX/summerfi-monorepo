import { type SDKChainId, sdkSupportedChains } from '@summerfi/app-types'
import {
  Address,
  type ArmadaMigratablePosition,
  getChainInfoByChainId,
} from '@summerfi/sdk-common/common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export type MigratablePosition = ArmadaMigratablePosition & {
  chainId: SDKChainId
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
    try {
      const chainInfo = getChainInfoByChainId(chainId)
      const { user } = await backendSDK.users.getUserClient({
        walletAddress: address,
        chainInfo,
      })

      const positions = await backendSDK.armada.users.getMigratablePositions({
        user,
        chainInfo,
      })

      return positions
    } catch (error) {
      const chainInfo = getChainInfoByChainId(chainId)

      // Log error but continue with empty positions for this chain
      return {
        chainInfo,
        positions: [],
      }
    }
  })

  const results = await Promise.all(positionsPromises)

  return results.flatMap(({ chainInfo, positions }) =>
    positions.map((position) => ({
      ...position,
      chainId: chainInfo.chainId,
    })),
  )
}
