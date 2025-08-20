import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type MetadataRoute } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const configRaw = await unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
    revalidate: REVALIDATION_TIMES.CONFIG,
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
