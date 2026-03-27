import { unstable_cache as unstableCache } from 'next/cache'

import { getSumrStakingRewards } from '@/app/server-handlers/sumr-staking-rewards'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedSumrStakingRewards = ({
  walletAddress,
  sumrPriceUsd,
}: {
  walletAddress: string
  sumrPriceUsd: number
}) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getSumrStakingRewards, ['sumrStakingRewards'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ walletAddress, sumrPriceUsd })
}
