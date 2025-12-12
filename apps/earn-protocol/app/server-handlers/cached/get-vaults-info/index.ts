import { REVALIDATION_TAGS } from '@summerfi/app-earn-ui'
import { getVaultsInfo } from '@summerfi/app-server-handlers'
import { unstable_cache as unstableCache } from 'next/cache'

export const getCachedVaultsInfo = unstableCache(getVaultsInfo, [REVALIDATION_TAGS.VAULTS_LIST], {
  revalidate: 300, // 5 minutes
  tags: [REVALIDATION_TAGS.VAULTS_LIST],
})
