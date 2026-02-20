import { getVaultDetailsUrl, getVaultUrl } from '@summerfi/app-earn-ui'
import { parseServerResponseToClient, supportedSDKNetwork } from '@summerfi/app-utils'
import { type MetadataRoute } from 'next'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedIsVaultDaoManaged } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ vaults }, configRaw] = await Promise.all([getCachedVaultsList(), getCachedConfig()])
  const systemConfig = parseServerResponseToClient(configRaw)
  const daoManagedVaultsList = (
    await Promise.all(
      vaults.map(async (v) => {
        const isDaoManaged = await getCachedIsVaultDaoManaged({
          fleetAddress: v.id,
          network: supportedSDKNetwork(v.protocol.network),
        })

        return isDaoManaged ? v.id : false
      }),
    )
  ).filter(Boolean) as `0x${string}`[]
  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
    daoManagedVaultsList,
  })

  const isStaging = systemConfig.deployment?.isStaging

  if (isStaging) {
    return []
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://summer.fi',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: 'https://summer.fi/earn',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: 'https://summer.fi/earn/user-activity',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://summer.fi/earn/rebalance-activity',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://summer.fi/institutions',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://summer.fi/institutions/self-managed-vaults',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://summer.fi/institutions/public-access-vaults',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://summer.fi/team',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  const vaultsMap: MetadataRoute.Sitemap = vaultsWithConfig.map((vault) => ({
    url: `https://summer.fi/earn${getVaultUrl(vault)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  const vaultsDetailsMap: MetadataRoute.Sitemap = vaultsWithConfig.map((vault) => ({
    url: `https://summer.fi/earn${getVaultDetailsUrl(vault)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const map: MetadataRoute.Sitemap = [...staticPages, ...vaultsMap, ...vaultsDetailsMap]

  return map
}
