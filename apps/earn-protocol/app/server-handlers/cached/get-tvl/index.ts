import { unstable_cache as unstableCache } from 'next/cache'

import { getTvl } from '@/app/server-handlers/raw-calls/tvl/get-tvl'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedTvl = unstableCache(getTvl, ['vaultsList'], {
  revalidate: CACHE_TIMES.VAULTS_LIST,
  tags: [CACHE_TAGS.VAULTS_LIST],
})
