import { sdkSupportedChains } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export const getVaultsList = async () => {
  const vaultsListByNetwork = await Promise.all(
    sdkSupportedChains.map((networkId) => {
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

  return {
    vaults: vaultsFlatList,
    callDataTimestamp: Date.now(),
  }
}
