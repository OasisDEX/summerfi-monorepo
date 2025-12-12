import { unstable_cache as unstableCache } from 'next/cache'

import { getPositionsActivePeriods } from '@/app/server-handlers/raw-calls/positions-active-periods'

export const getCachedPositionsActivePeriods = ({ walletAddress }: { walletAddress: string }) => {
  return unstableCache(getPositionsActivePeriods, [`position-active-periods-${walletAddress}`], {
    revalidate: 300, // 5 minutes
  })(walletAddress)
}
