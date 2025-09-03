import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { serverOnlyErrorHandler, subgraphNetworkToId } from '@summerfi/app-utils'
import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  type IArmadaVaultInfo,
} from '@summerfi/sdk-common'

import { backendSDK } from '@/sdk/sdk-backend-client'

/**
 * Fetches the information of an Armada vault by its ID.
 *
 * This function retrieves the information of an Armada vault by creating a vault ID from
 * the provided network and vault address, then making a request to the backend SDK.
 * It returns the vault information or throws an error if the request fails.
 * @param {Object} params - The parameters for fetching the vault information
 * @param {SupportedSDKNetworks} params.network - The network of the vault
 * @param {string} params.vaultAddress - The address of the vault
 * @returns {Promise<IArmadaVaultInfo | undefined>} The vault information or undefined if the request fails
 *
 * @throws {Error} When the request fails
 *
 * @example
 * ```typescript
 * const vaultInfo = await getVaultInfo({ network: 'ethereum', vaultAddress: '0x123...', })
 * ```
 */
export const getVaultInfo = async ({
  network,
  vaultAddress,
}: {
  network: SupportedSDKNetworks
  vaultAddress: string
}): Promise<IArmadaVaultInfo | undefined> => {
  try {
    const chainId = subgraphNetworkToId(network)
    const chainInfo = getChainInfoByChainId(chainId)
    const fleetAddress = Address.createFromEthereum({
      value: vaultAddress,
    })

    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })

    const vault = await backendSDK.armada.users.getVaultInfo({
      vaultId,
    })

    return vault
  } catch (error) {
    serverOnlyErrorHandler('getVaultInfo', error as string)

    return undefined
  }
}
