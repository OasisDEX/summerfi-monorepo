import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultsListRaw } from '@/app/server-handlers/sdk/get-vaults-list'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedVaultsList = unstableCache(getVaultsListRaw, [], {
  revalidate: CACHE_TIMES.VAULTS_LIST,
  tags: [CACHE_TAGS.VAULTS_LIST],
})
