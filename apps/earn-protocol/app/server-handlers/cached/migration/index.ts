import { unstable_cache as unstableCache } from 'next/cache'

import { getMigratablePositions } from '@/app/server-handlers/raw-calls/migration'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-user-data-cache-handler'

export const getCachedMigratablePositions = ({ walletAddress }: { walletAddress: string }) => {
  return unstableCache(getMigratablePositions, [], {
    revalidate: CACHE_TIMES.MIGRATION_DATA,
    tags: [CACHE_TAGS.MIGRATION_DATA, getUserDataCacheHandler(walletAddress)],
  })({ walletAddress })
}
