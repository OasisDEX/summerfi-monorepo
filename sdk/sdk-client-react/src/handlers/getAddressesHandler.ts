import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId } from '@summerfi/sdk-common'

/**
 * @name getAddressesHandler
 * @description Returns the deployed contract addresses for the Armada protocol on a given chain
 * @param params.chainId The chain ID to retrieve addresses for
 * @returns Record containing the admiralsQuarters contract address
 */
export const getAddressesHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ chainId }: { chainId: ChainId }) => {
    return sdk.armada.users.getProtocolAddresses({ chainId })
  }
