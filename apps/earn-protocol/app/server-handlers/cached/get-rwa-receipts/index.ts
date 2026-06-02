import { unstable_cache as unstableCache } from 'next/cache'

import { getRwaReceipts } from '@/app/server-handlers/sdk/get-rwa-receipts'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

export const getCachedRwaReceipts = ({
  chainId,
  fleetAddress,
  walletAddress,
}: {
  chainId: number
  fleetAddress: string
  walletAddress: string
}) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getRwaReceipts, ['rwaReceipts'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ chainId, fleetAddress, walletAddress })
}
