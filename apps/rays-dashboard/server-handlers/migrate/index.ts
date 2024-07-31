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
        next: { revalidate: 60, tags: [address] },
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

      const filteredMigrations = migrations.migrationsV2.filter((migration) => {
        if (migration.positionAddressType === 'EOA') {
          return true
        }
        const networkMigration = networksByChainId[migration.chainId].id

        switch (networkMigration) {
          case NetworkIds.MAINNET:
            return DsProxyMigrationEthereum
          case NetworkIds.ARBITRUMMAINNET:
            return DsProxyMigrationArbitrum
          case NetworkIds.OPTIMISMMAINNET:
            return DsProxyMigrationOptimism
          case NetworkIds.BASEMAINNET:
            return DsProxyMigrationBase
          default:
            return false
        }
      })

      return { ...migrations, migrationsV2: filteredMigrations }
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
