import { getVaultsInfo } from '@summerfi/app-server-handlers'
import { unstable_cache as unstableCache } from 'next/cache'

import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedVaultsInfo = unstableCache(getVaultsInfo, [], {
  revalidate: CACHE_TIMES.VAULTS_LIST,
  tags: [CACHE_TAGS.VAULTS_LIST],
})
