import { SupportedNetworkIds } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export const getRwaVaultsInfoListRaw = async () => {
  const vaultsListByNetwork = await Promise.all(
    Object.values(SupportedNetworkIds)
      .filter((networkId): networkId is 8453 => networkId === 8453) // temporarily filter for Base Mainnet only, to be updated when more networks are supported
      // .filter((networkId): networkId is number => typeof networkId === 'number')
      .map((networkId) =>
        backendSDK.rwa.getVaultInfoListPerChain({
          chainId: getChainInfoByChainId(networkId).chainId,
          clientId: 'ExtDemoCorp_v2', // testing clientId, to be replaced with the actual one when available
        }),
      ),
  )

  return {
    vaults: vaultsListByNetwork.flatMap(({ list }) => list),
    callDataTimestamp: Date.now(),
  }
}
