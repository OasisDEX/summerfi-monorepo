import { unstable_cache as unstableCache } from 'next/cache'

import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedSumrDelegateStake = ({ walletAddress }: { walletAddress: string }) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getSumrDelegateStake, ['sumrDelegateStake'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ walletAddress })
}
