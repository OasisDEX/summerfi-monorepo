'use server'

import { type PortfolioMigrations } from '@summerfi/app-types'

import { NetworkIds, networksByChainId } from '@/constants/networks-list'
import { type SystemConfig } from '@/server-handlers/system-config'

export const fetchMigrations = async ({
  address,
  systemConfig,
}: {
  address: string
  systemConfig: SystemConfig
}): Promise<PortfolioMigrations> => {
  try {
    if (!address) {
      throw new Error('No address provided')
    }
    const migrations = (await fetch(
      `${process.env.FUNCTIONS_API_URL}/api/migrations?address=${address}`,
      {
        method: 'GET',
        next: { revalidate: 0 }, // disabling cache as user values doesnt match the leaderboard position
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((resp) => resp.json())) as PortfolioMigrations

    if (systemConfig.config.features) {
      const {
        DsProxyMigrationArbitrum,
        DsProxyMigrationBase,
        DsProxyMigrationEthereum,
        DsProxyMigrationOptimism,
      } = systemConfig.config.features

      return {
        ...migrations,
        migrationsV2: migrations.migrationsV2.filter((migration) => {
          if (migration.positionAddressType === 'EOA') {
            return true
          }
          const networkMigration = networksByChainId[migration.chainId].id

          if (networkMigration === NetworkIds.MAINNET) {
            return DsProxyMigrationEthereum
          } else if (networkMigration === NetworkIds.ARBITRUMMAINNET) {
            return DsProxyMigrationArbitrum
          } else if (networkMigration === NetworkIds.OPTIMISMMAINNET) {
            return DsProxyMigrationOptimism
          } else if (networkMigration === NetworkIds.BASEMAINNET) {
            return DsProxyMigrationBase
          }

          return false
        }),
      }
    }

    return migrations
  } catch (error) {
    return {
      migrations: [],
      migrationsV2: [],
      error,
    }
  }
}
