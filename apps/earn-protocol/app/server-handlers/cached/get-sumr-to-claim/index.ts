import { unstable_cache as unstableCache } from 'next/cache'

import { getSumrToClaim, type SumrToClaimData } from '@/app/server-handlers/sumr-to-claim'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-user-data-cache-handler'

/**
 * Cached wrapper for getSumrToClaim with proper tagging for revalidation
 * This ensures revalidateTag works correctly for SUMR claim data
 */
export const getCachedSumrToClaim = (walletAddress: string): Promise<SumrToClaimData> => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getSumrToClaim, ['sumrToClaim', userKey], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ walletAddress })
}
