import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type MetadataRoute } from 'next'

import { getCachedConfig } from '@/app/server-handlers/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const configRaw = await getCachedConfig()

  const systemConfig = parseServerResponseToClient(configRaw)

  const isStaging = systemConfig.deployment?.isStaging

  if (isStaging) {
    return []
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://institutions.summer.fi',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
  ]

  const map: MetadataRoute.Sitemap = [...staticPages]

  return map
}
