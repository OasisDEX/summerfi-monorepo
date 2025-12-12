import { REVALIDATION_TAGS } from '@summerfi/app-earn-ui'
import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { unstable_cache as unstableCache } from 'next/cache'

export const getCachedConfig = unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
  revalidate: 60, // 1 minute,
})
