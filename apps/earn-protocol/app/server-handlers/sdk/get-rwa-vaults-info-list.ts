import { SupportedNetworkIds } from '@summerfi/app-types'
import { getChainInfoByChainId } from '@summerfi/sdk-common'

import { backendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { RWA_CLIENT_ID } from '@/constants/rwa'

export const getRwaVaultsInfoListRaw = async () => {
  const vaultsListByNetwork = await Promise.all(
    Object.values(SupportedNetworkIds)
      .filter((networkId): networkId is 8453 => networkId === 8453) // temporarily filter for Base Mainnet only, to be updated when more networks are supported
      // .filter((networkId): networkId is number => typeof networkId === 'number')
      .map((networkId) =>
        backendInstiSDK.rwa.getVaultInfoListPerChain({
          chainId: getChainInfoByChainId(networkId).chainId,
          clientId: RWA_CLIENT_ID,
        }),
      ),
  )

  return {
    vaults: vaultsListByNetwork.flatMap(({ list }) => list),
    callDataTimestamp: Date.now(),
  }
}
