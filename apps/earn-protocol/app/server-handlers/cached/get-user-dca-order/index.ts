import type { ChainId } from '@summerfi/sdk-common'
import { unstable_cache as unstableCache } from 'next/cache'

import { getUserDcaOrder } from '@/app/server-handlers/sdk/get-user-dca-order'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedUserDcaOrder = ({
  chainId,
  orderId,
}: {
  chainId: ChainId
  orderId: string
}) => {
  const userKey = orderId

  return unstableCache(getUserDcaOrder, ['userDcaOrder'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ chainId, orderId })
}
