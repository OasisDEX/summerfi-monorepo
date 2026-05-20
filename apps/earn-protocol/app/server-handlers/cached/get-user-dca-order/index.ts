import { unstable_cache as unstableCache } from 'next/cache'

import { getUserDcaOrder } from '@/app/server-handlers/sdk/get-user-dca-order'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedUserDcaOrder = ({
  walletAddress,
  orderId,
}: {
  walletAddress: string
  orderId: string
}) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getUserDcaOrder, ['userDcaOrder'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ walletAddress, orderId })
}
