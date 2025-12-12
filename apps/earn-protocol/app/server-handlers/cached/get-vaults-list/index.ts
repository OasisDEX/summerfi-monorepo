import { REVALIDATION_TAGS } from '@summerfi/app-earn-ui'
import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultsListRaw } from '@/app/server-handlers/sdk/get-vaults-list'

export const getCachedVaultsList = unstableCache(getVaultsListRaw, [], {
  revalidate: 300, // 5 minutes
  tags: [REVALIDATION_TAGS.VAULTS_LIST],
})
