import { unstable_cache as unstableCache } from 'next/cache'

import { getRwaVaultsInfoListRaw } from '@/app/server-handlers/sdk/get-rwa-vaults-info-list'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedRwaVaultsInfo = unstableCache(getRwaVaultsInfoListRaw, ['rwaVaultsInfo'], {
  revalidate: CACHE_TIMES.RWA_VAULTS_INFO,
  tags: [CACHE_TAGS.RWA_VAULTS_INFO],
})
