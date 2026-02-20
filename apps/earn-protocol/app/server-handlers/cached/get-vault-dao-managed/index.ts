import { type SDKVaultishType, type SupportedSDKNetworks } from '@summerfi/app-types'
import { supportedSDKNetwork } from '@summerfi/app-utils'
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

export const getDaoManagedVaultsIDsList = async (vaults: SDKVaultishType[]) =>
  (
    await Promise.all(
      vaults.map(async (v) => {
        const isDaoManaged = await getCachedIsVaultDaoManaged({
          fleetAddress: v.id,
          network: supportedSDKNetwork(v.protocol.network),
        })

        return isDaoManaged ? v.id : false
      }),
    )
  ).filter(Boolean) as `0x${string}`[]
