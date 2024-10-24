import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/helpers/sdk/sdk-backend-client'
import { sdkSupportedNetworks } from '@/server-handlers/sdk/constants/sdk-supported-networks'

export const getVaultsList = async () => {
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
