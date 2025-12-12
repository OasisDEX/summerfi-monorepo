import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultsListRaw } from '@/app/server-handlers/sdk/get-vaults-list'

export const getCachedVaultsList = unstableCache(getVaultsListRaw, [], {
  revalidate: REVALIDATION_TIMES.VAULTS_LIST,
  tags: [REVALIDATION_TAGS.VAULTS_LIST],
})
