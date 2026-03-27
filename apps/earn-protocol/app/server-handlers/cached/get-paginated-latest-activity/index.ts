import { unstable_cache as unstableCache } from 'next/cache'

import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

type GetPaginatedLatestActivityArgs = Parameters<typeof getPaginatedLatestActivity>[0]

export const getCachedPaginatedLatestActivity = ({
  walletAddress,
  ...args
}: GetPaginatedLatestActivityArgs & {
  walletAddress: string
}) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getPaginatedLatestActivity, ['paginatedLatestActivity'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })(args)
}
