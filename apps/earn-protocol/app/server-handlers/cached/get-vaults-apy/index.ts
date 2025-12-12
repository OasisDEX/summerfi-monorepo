import { REVALIDATION_TAGS } from '@summerfi/app-earn-ui'
import { getVaultsApy } from '@summerfi/app-server-handlers'
import { unstable_cache as unstableCache } from 'next/cache'

export const getCachedVaultsApy = unstableCache(getVaultsApy, [], {
  revalidate: 300, // 5 minutes
  tags: [REVALIDATION_TAGS.VAULTS_LIST],
})
