import { SupportedNetworkIds } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export const getVaultsListRaw = async () => {
  const networkIds = Object.values(SupportedNetworkIds).filter(
    (networkId): networkId is number => typeof networkId === 'number',
  )

  const vaultsListByNetworkResults = await Promise.allSettled(
    networkIds.map((networkId) =>
      backendSDK.armada.users.getVaultsRaw({
        chainInfo: getChainInfoByChainId(Number(networkId)),
      }),
    ),
  )

  const vaultsListByNetwork = vaultsListByNetworkResults.flatMap((result, index) => {
    if (result.status === 'rejected') {
      try {
        serverOnlyErrorHandler('getVaultsListRaw', result.reason as string, {
          chainId: networkIds[index],
        })
      } catch {
        // serverOnlyErrorHandler always throws after logging; swallow it so one chain's
        // failure doesn't take down the whole cross-chain vaults list.
      }

      return []
    }

    return [result.value]
  })

  return {
    vaults: vaultsListByNetwork.flatMap(({ vaults }) => vaults),
    callDataTimestamp: Date.now(),
  }
}
