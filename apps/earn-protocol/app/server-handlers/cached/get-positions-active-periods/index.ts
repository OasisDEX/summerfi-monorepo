import { unstable_cache as unstableCache } from 'next/cache'

import { getPositionsActivePeriods } from '@/app/server-handlers/raw-calls/positions-active-periods'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedPositionsActivePeriods = ({ walletAddress }: { walletAddress: string }) => {
  return unstableCache(getPositionsActivePeriods, [], {
    revalidate: CACHE_TIMES.POSITIONS_ACTIVE_PERIODS,
    tags: [CACHE_TAGS.POSITIONS_ACTIVE_PERIODS, walletAddress.toLowerCase()],
  })(walletAddress)
}
