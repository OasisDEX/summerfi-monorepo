import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, AddressValue } from '@summerfi/sdk-common'

/**
 * @name setWhitelistedBatchTxHandler
 * @description Sets the whitelist status for multiple addresses in the FleetCommander contract
 * @param params.chainId The chain ID to set the whitelist status on
 * @param params.fleetCommanderAddress The FleetCommander contract address
 * @param params.targetAddresses The addresses to set the whitelist status for
 * @param params.allowed The whitelist statuses to set (must match the length of targetAddresses)
 */
export const setWhitelistedBatchTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    fleetCommanderAddress,
    targetAddresses,
    allowed,
  }: {
    chainId: ChainId
    fleetCommanderAddress: AddressValue
    targetAddresses: AddressValue[]
    allowed: boolean[]
  }) => {
    return sdk.armada.accessControl.setWhitelistedBatch({
      chainId,
      fleetCommanderAddress,
      targetAddresses,
      allowed,
    })
  }
