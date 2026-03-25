import { unstable_cache as unstableCache } from 'next/cache'

import { getLandingPageSumrStakingV2Data } from '@/app/server-handlers/raw-calls/sumr-staking-v2'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedLandingPageSumrStakingV2Data = ({
  sumrPriceUsd,
}: {
  sumrPriceUsd: number
}) => {
  return unstableCache(getLandingPageSumrStakingV2Data, ['landingPageSumrStakingV2Data'], {
    revalidate: CACHE_TIMES.STAKING_V2_GLOBAL_DATA,
    tags: [CACHE_TAGS.STAKING_V2_GLOBAL_DATA],
  })({ sumrPriceUsd })
}
