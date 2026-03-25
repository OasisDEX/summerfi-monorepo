import { type SDKVaultishType, type SupportedSDKNetworks } from '@summerfi/app-types'
import { supportedSDKNetwork } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'

import { getIsVaultDaoManaged } from '@/app/server-handlers/get-vault-dao-managed'
import { CACHE_TIMES } from '@/constants/revalidation'
import { getVaultDaoManagedTag } from '@/helpers/get-cache-handler-name'

export const getCachedIsVaultDaoManaged = ({
  fleetAddress,
  network,
}: {
  fleetAddress: string
  network: SupportedSDKNetworks
}) => {
  return unstableCache(getIsVaultDaoManaged, ['is-vault-dao-managed'], {
    revalidate: CACHE_TIMES.ONE_DAY,
    tags: [getVaultDaoManagedTag(fleetAddress, `${network}`)],
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
