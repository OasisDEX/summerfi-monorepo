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
  clientId,
}: {
  chainId: number
  fleetAddress: string
  walletAddress: string
  // Institution that owns the vault (its `vaultInstitutionId`) — selects the SDK deployment to read
  // exposure from, and is part of the cache key via the forwarded args.
  clientId: string
}) => {
  const userKey = walletAddress.toLowerCase()

  return unstableCache(getRwaUserVaultExposure, ['rwaUserExposure'], {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
  })({ chainId, fleetAddress, walletAddress, clientId })
}
