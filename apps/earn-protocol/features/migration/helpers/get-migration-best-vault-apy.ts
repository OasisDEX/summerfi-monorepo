import { type GetVaultsApyResponse, type SDKVaultsListType } from '@summerfi/app-types'
import {
  subgraphNetworkToId,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'

import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'

/**
 * Calculates the best vault APY data for each chain ID from migratable positions.
 *
 * This function processes a list of migratable positions and determines the best
 * current APY and 30-day APY available for each chain ID. It uses vault configuration
 * and APY data to find the highest performing vaults on each network.
 *
 * @param {Object} params - The parameters for calculating migration APY data
 * @param {MigratablePosition[]} params.migratablePositions - List of positions that can be migrated
 * @param {SDKVaultsListType} params.vaultsWithConfig - List of vaults with their configurations
 * @param {GetVaultsApyResponse} params.vaultsApyByNetworkMap - Map of vault APYs by network
 * @returns {MigrationEarningsDataByChainId} Object mapping chain IDs to their best APY data
 */
export const getMigrationBestVaultApy = ({
  migratablePositions,
  vaultsWithConfig,
  vaultsApyByNetworkMap,
}: {
  migratablePositions: MigratablePosition[]
  vaultsWithConfig: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
}): MigrationEarningsDataByChainId => {
  return migratablePositions.reduce(
    (acc, position) => {
      const { chainId } = position

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!acc[chainId]) {
        // Find all vaults for this network
        const networkVaults = vaultsWithConfig.filter(
          (vault) =>
            subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network)) === chainId,
        )

        // Find the best current APY and 7d and 30d APY for this network
        let bestCurrentApy = 0
        let best30dApy = 0
        let best7dApy = 0

        networkVaults.forEach((vault) => {
          const { apy, sma7d, sma30d } =
            vaultsApyByNetworkMap[
              `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
            ]
          const currentApy = apy || 0
          const apy30d = sma30d ?? 0
          const apy7d = sma7d ?? 0

          if (currentApy > bestCurrentApy) {
            bestCurrentApy = currentApy
          }

          if (apy30d > best30dApy) {
            best30dApy = apy30d
          }

          if (apy7d > best7dApy) {
            best7dApy = apy7d
          }
        })

        acc[chainId] = {
          lazySummerCurrentApy: bestCurrentApy,
          lazySummer30dApy: best30dApy === 0 ? undefined : best30dApy,
          lazySummer7dApy: best7dApy === 0 ? undefined : best7dApy,
        }
      }

      return acc
    },
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as MigrationEarningsDataByChainId,
  )
}
