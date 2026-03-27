import { unstable_cache as unstableCache } from 'next/cache'

import { getPortfolioSumrStakingV2Data } from '@/app/server-handlers/raw-calls/sumr-staking-v2'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedPortfolioSumrStakingV2Data = ({
  walletAddress,
  sumrPriceUsd,
}: {
  walletAddress: string
  sumrPriceUsd: number
}) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getPortfolioSumrStakingV2Data, ['portfolioSumrStakingV2Data'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ walletAddress, sumrPriceUsd })
}
