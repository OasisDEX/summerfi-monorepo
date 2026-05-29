import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { unstable_cache as unstableCache } from 'next/cache'

import { getRwaVaultDetails } from '@/app/server-handlers/sdk/get-rwa-vault-details'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getVaultDetailsTag } from '@/helpers/get-cache-handler-name'

export const getCachedRwaVaultDetails = ({
  vaultAddress,
  network,
}: {
  vaultAddress: string
  network: SupportedSDKNetworks
}) => {
  return unstableCache(getRwaVaultDetails, ['rwaVaultDetails'], {
    revalidate: CACHE_TIMES.RWA_VAULTS_INFO,
    tags: [getVaultDetailsTag(vaultAddress, `${network}`), CACHE_TAGS.RWA_VAULTS_INFO],
  })({
    vaultAddress,
    network,
  })
}
