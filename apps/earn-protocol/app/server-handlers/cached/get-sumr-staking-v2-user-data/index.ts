import { unstable_cache as unstableCache } from 'next/cache'

import { getLandingPageSumrStakingV2UserData } from '@/app/server-handlers/raw-calls/sumr-staking-v2'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedSumrStakingV2UserData = ({
  walletAddress,
  sumrPriceUsd,
}: {
  walletAddress: string
  sumrPriceUsd: number
}) => {
  return unstableCache(getLandingPageSumrStakingV2UserData, ['sumrStakingV2UserData'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA, // same TTL as PORTFOLIO_DATA
    tags: [getUserDataCacheHandler(walletAddress)],
  })({ walletAddress, sumrPriceUsd })
}
