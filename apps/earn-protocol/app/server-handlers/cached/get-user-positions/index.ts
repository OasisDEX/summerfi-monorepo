import { unstable_cache as unstableCache } from 'next/cache'

import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedUserPositions = ({ walletAddress }: { walletAddress: string }) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getUserPositions, ['userPositions'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ walletAddress })
}
