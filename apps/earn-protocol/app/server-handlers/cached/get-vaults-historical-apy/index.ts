import { getVaultsHistoricalApy } from '@summerfi/app-server-handlers'
import { unstable_cache as unstableCache } from 'next/cache'

import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedVaultsHistoricalApy = (
  args: Parameters<typeof getVaultsHistoricalApy>[0],
) => {
  return unstableCache(getVaultsHistoricalApy, ['vaultsHistoricalApy'], {
    revalidate: CACHE_TIMES.INTEREST_RATES,
    tags: [CACHE_TAGS.INTEREST_RATES],
  })(args)
}
