import { unstable_cache as unstableCache } from 'next/cache'

import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedSumrStakingInfo = ({ walletAddress }: { walletAddress: string }) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getSumrStakingInfo, ['sumrStakingInfo'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })()
}
