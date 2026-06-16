import { unstable_cache as unstableCache } from 'next/cache'

import { getRwaUserVaultExposure } from '@/app/server-handlers/sdk/get-rwa-user-vault-exposure'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-cache-handler-name'

// Cached per wallet under the user-data tag, so the existing revalidateUser() calls (after a
// deposit/claim/cancel) bust it. Shared by the manage page's routing gate and the core-data handler
// so they make a single network call.
export const getCachedRwaUserVaultExposure = ({
  chainId,
  fleetAddress,
  walletAddress,
}: {
  chainId: number
  fleetAddress: string
  walletAddress: string
}) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getRwaUserVaultExposure, ['rwaUserExposure'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ chainId, fleetAddress, walletAddress })
}
