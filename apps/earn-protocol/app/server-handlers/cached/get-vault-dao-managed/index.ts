import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { unstable_cache as unstableCache } from 'next/cache'

import { getIsVaultDaoManaged } from '@/app/server-handlers/get-vault-dao-managed'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'

export const getCachedIsVaultDaoManaged = ({
  fleetAddress,
  network,
}: {
  fleetAddress: string
  network: SupportedSDKNetworks
}) => {
  return unstableCache(getIsVaultDaoManaged, [`is-vault-dao-managed-${fleetAddress}-${network}`], {
    revalidate: CACHE_TIMES.ONE_DAY,
    tags: [`${CACHE_TAGS.VAULT_DAO_MANAGED}-${fleetAddress}-${network}`],
  })({ fleetAddress, network })
}
