import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultsPausedMap, type VaultsPausedMap } from '@/app/server-handlers/vaults-paused'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

/**
 * On-chain `paused()` state of the always-visible vaults, cached for 1 minute so the vaults list
 * reflects a pause/unpause quickly without an RPC round trip on every request. Falls back to an
 * empty map (nothing rendered as paused) on error.
 */
export const getCachedVaultsPausedMap = async (): Promise<VaultsPausedMap> => {
  try {
    return await unstableCache(getVaultsPausedMap, ['vaultsPaused'], {
      revalidate: CACHE_TIMES.VAULTS_PAUSED,
      tags: [CACHE_TAGS.VAULTS_PAUSED],
    })()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching vaults paused map:', error)

    return {}
  }
}
