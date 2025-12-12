import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { getVaultsInfo } from '@summerfi/app-server-handlers'
import { unstable_cache as unstableCache } from 'next/cache'

export const getCachedVaultsInfo = unstableCache(getVaultsInfo, [REVALIDATION_TAGS.VAULTS_LIST], {
  revalidate: REVALIDATION_TIMES.VAULTS_LIST,
  tags: [REVALIDATION_TAGS.VAULTS_LIST],
})
