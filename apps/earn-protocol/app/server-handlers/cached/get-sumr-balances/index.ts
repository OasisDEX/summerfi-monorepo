import { unstable_cache as unstableCache } from 'next/cache'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedSumrBalances = ({ walletAddress }: { walletAddress: string }) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getSumrBalances, ['sumrBalances'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ walletAddress })
}
