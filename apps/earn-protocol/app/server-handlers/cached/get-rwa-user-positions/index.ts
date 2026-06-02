import { unstable_cache as unstableCache } from 'next/cache'

import { getRwaUserPositions } from '@/app/server-handlers/sdk/get-rwa-user-positions'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedRwaUserPositions = ({ walletAddress }: { walletAddress: string }) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getRwaUserPositions, ['rwaUserPositions'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ walletAddress })
}
