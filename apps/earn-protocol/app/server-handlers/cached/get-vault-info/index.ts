import { getVaultInfo } from '@summerfi/app-server-handlers'
import { unstable_cache as unstableCache } from 'next/cache'

import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedVaultInfo = (args: Parameters<typeof getVaultInfo>[0]) => {
  return unstableCache(getVaultInfo, ['vaultInfo'], {
    revalidate: CACHE_TIMES.INTEREST_RATES,
    tags: [CACHE_TAGS.INTEREST_RATES],
  })(args)
}
