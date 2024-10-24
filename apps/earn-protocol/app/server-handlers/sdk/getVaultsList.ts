import { sdkSupportedNetworks } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getVaultsList() {
  const vaultsListByNetwork = await Promise.all(
    sdkSupportedNetworks.map((networkId) => {
      const chainInfo = getChainInfoByChainId(networkId)

      return backendSDK.armada.users.getVaultsRaw({
        chainInfo,
      })
    }),
  )

  // flatten the list
  const vaultsFlatList = vaultsListByNetwork.reduce<(typeof vaultsListByNetwork)[number]['vaults']>(
    (acc, { vaults }) => [...acc, ...vaults],
    [],
  )

  return vaultsFlatList
}
