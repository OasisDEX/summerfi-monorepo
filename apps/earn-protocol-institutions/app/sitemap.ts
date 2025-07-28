import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type MetadataRoute } from 'next'

import systemConfigHandler from '@/app/server-handlers/system-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [configRaw] = await Promise.all([systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)

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
