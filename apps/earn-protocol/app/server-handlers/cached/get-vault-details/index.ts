import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getVaultDetailsTag } from '@/helpers/get-cache-handler-name'

export const getCachedVaultDetails = ({
  vaultAddress,
  network,
}: {
  vaultAddress: string
  network: SupportedSDKNetworks
}) => {
  return unstableCache(getVaultDetails, ['vaultDetails'], {
    revalidate: CACHE_TIMES.VAULTS_LIST,
    tags: [getVaultDetailsTag(vaultAddress, `${network}`), CACHE_TAGS.VAULTS_LIST],
  })({
    vaultAddress,
    network,
  })
}
