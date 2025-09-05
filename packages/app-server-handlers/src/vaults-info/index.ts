import { SupportedNetworkIds, type SupportedSDKNetworks } from '@summerfi/app-types'
import { serverOnlyErrorHandler, subgraphNetworkToId } from '@summerfi/app-utils'
import { getChainInfoByChainId, type IArmadaVaultInfo } from '@summerfi/sdk-common'

import { backendSDK } from '@/sdk/sdk-backend-client'

/**
 * Fetches the information of all Armada vaults for all chains.
 *
 * This function retrieves the information of all Armada vaults for all chains, then making a request to the backend SDK.
 * It returns the vaults information or undefined if the request fails.
 * @returns {Promise<{ list: IArmadaVaultInfo[] } | undefined>} The vaults information or undefined if the request fails
 *
 * @example
 * ```typescript
 * const vaultsInfo = await getVaultsInfo()
 * ```
 */
export const getVaultsInfo = async (): Promise<IArmadaVaultInfo[] | undefined> => {
  try {
    const chainIds = Object.values(SupportedNetworkIds).filter(
      (id): id is number => typeof id === 'number',
    )

    const vaultsInfo = await Promise.all(
      chainIds.map((id) =>
        backendSDK.armada.users.getVaultInfoList({
          chainId: getChainInfoByChainId(id).chainId,
        }),
      ),
    )

    return vaultsInfo.flatMap(({ list }) => list)
  } catch (error) {
    serverOnlyErrorHandler('getVaultsInfo', error as string)

    return undefined
  }
}

/**
 * Fetches the information of all Armada vaults for a given network.
 *
 * This function retrieves the information of all Armada vaults for a given network, then making a request to the backend SDK.
 * It returns the vaults information or undefined if the request fails.
 * @param {SupportedSDKNetworks} network - The network of the vaults
 * @returns {Promise<IArmadaVaultInfo[] | undefined>} The vaults information or undefined if the request fails
 *
 * @example
 * ```typescript
 * const vaultsInfo = await getVaultsInfoByNetwork('MAINNET')
 * ```
 */
export const getVaultsInfoByNetwork = async (
  network: SupportedSDKNetworks,
): Promise<IArmadaVaultInfo[] | undefined> => {
  try {
    const chainId = subgraphNetworkToId(network)
    const chainInfo = getChainInfoByChainId(chainId)

    const vaultsInfo = await backendSDK.armada.users.getVaultInfoList({
      chainId: chainInfo.chainId,
    })

    return vaultsInfo.list
  } catch (error) {
    serverOnlyErrorHandler('getVaulttInfoByNetwork', error as string)

    return undefined
  }
}
