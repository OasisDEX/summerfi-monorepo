import { SupportedNetworkIds } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'
import { type GetVaultsQueryRwa } from '@summerfi/subgraph-manager-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export const getRwaVaultsListRaw: () => Promise<{
  vaults: GetVaultsQueryRwa['vaults']
  callDataTimestamp: number
}> = async () => {
  const vaultsListByNetwork = await Promise.all(
    Object.values(SupportedNetworkIds)
      .filter((networkId): networkId is 8453 => networkId === 8453) // temporarily filter for Base Mainnet only, to be updated when more networks are supported
      // .filter((networkId): networkId is number => typeof networkId === 'number')
      .map((networkId) =>
        backendSDK.rwa.getVaultsRaw({
          chainInfo: getChainInfoByChainId(networkId),
          clientId: 'ExtDemoCorp_v2', // testing clientId, to be replaced with the actual one when available
        }),
      ),
  )

  return {
    vaults: vaultsListByNetwork.flatMap(({ vaults }) => vaults),
    callDataTimestamp: Date.now(),
  }
}
