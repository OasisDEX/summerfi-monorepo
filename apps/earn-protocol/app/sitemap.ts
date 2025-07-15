import { getVaultDetailsUrl, getVaultUrl } from '@summerfi/app-earn-ui'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type MetadataRoute } from 'next'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
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
