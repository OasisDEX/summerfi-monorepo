import { unstable_cache as unstableCache } from 'next/cache'

import { getSumrStakingV2AllStakesData } from '@/app/server-handlers/raw-calls/sumr-staking-v2'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedSumrStakingV2AllStakesData = () => {
  return unstableCache(getSumrStakingV2AllStakesData, ['sumrStakingV2AllStakesData'], {
    revalidate: CACHE_TIMES.STAKING_V2_GLOBAL_DATA,
    tags: [CACHE_TAGS.STAKING_V2_GLOBAL_DATA],
  })()
}
