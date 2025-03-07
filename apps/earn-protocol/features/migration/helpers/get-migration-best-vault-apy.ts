import { type SDKVaultsListType } from '@summerfi/app-types'
import { subgraphNetworkToId, subgraphNetworkToSDKId } from '@summerfi/app-utils'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
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

      if (!acc[chainId]) {
        // Find all vaults for this network
        const networkVaults = vaultsWithConfig.filter(
          (vault) => subgraphNetworkToSDKId(vault.protocol.network) === chainId,
        )

        // Find the best current APY and 7d and 30d APY for this network
        let bestCurrentApy = 0
        let best30dApy = 0
        let best7dApy = 0

        networkVaults.forEach((vault) => {
          const vaultApy =
            vaultsApyByNetworkMap[`${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`]
          const currentApy = vaultApy || 0
          const apy30d = Number(vault.apr30d) / 100 || 0
          const apy7d = Number(vault.apr7d) / 100 || 0

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
          lazySummer30dApy: best30dApy,
          lazySummer7dApy: best7dApy,
        }
      }

      return acc
    },
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as MigrationEarningsDataByChainId,
  )
}
