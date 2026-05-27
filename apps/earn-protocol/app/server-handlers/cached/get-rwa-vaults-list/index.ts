import { unstable_cache as unstableCache } from 'next/cache'

import { getRwaVaultsListRaw } from '@/app/server-handlers/sdk/get-rwa-vaults-list'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedRwaVaultsList = unstableCache(getRwaVaultsListRaw, ['rwaVaultsList'], {
  revalidate: CACHE_TIMES.RWA_VAULTS_INFO,
  tags: [CACHE_TAGS.RWA_VAULTS_INFO],
})
