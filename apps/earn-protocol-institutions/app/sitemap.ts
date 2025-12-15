import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type MetadataRoute } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'

import { INSTITUTIONS_CACHE_TAGS, INSTITUTIONS_CACHE_TIMES } from '@/constants/revalidation'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const configRaw = await unstableCache(configEarnAppFetcher, [INSTITUTIONS_CACHE_TAGS.CONFIG], {
    revalidate: INSTITUTIONS_CACHE_TIMES.CONFIG,
  })()

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
