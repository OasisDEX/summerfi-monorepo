import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { unstable_cache as unstableCache } from 'next/cache'

import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedConfig = unstableCache(configEarnAppFetcher, [], {
  revalidate: CACHE_TIMES.CONFIG,
  tags: [CACHE_TAGS.CONFIG],
})
