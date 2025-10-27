import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, AddressValue } from '@summerfi/sdk-common'

/**
 * @name setWhitelistedTxHandler
 * @description Sets the whitelist status for an address in the FleetCommander contract
 * @param params.chainId The chain ID to set the whitelist status on
 * @param params.fleetCommanderAddress The FleetCommander contract address
 * @param params.targetAddress The address to set the whitelist status for
 * @param params.allowed The whitelist status to set
 */
export const setWhitelistedTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    fleetCommanderAddress,
    targetAddress,
    allowed,
  }: {
    chainId: ChainId
    fleetCommanderAddress: AddressValue
    targetAddress: AddressValue
    allowed: boolean
  }) => {
    return sdk.armada.accessControl.setWhitelisted({
      chainId,
      fleetCommanderAddress,
      targetAddress,
      allowed,
    })
  }
