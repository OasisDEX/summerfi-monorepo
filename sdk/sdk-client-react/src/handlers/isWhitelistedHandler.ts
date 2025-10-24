import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { ChainId, AddressValue } from '@summerfi/sdk-common'

/**
 * @name isWhitelistedHandler
 * @description Checks if an address is whitelisted in the FleetCommander contract
 * @param params.chainId The chain ID to check the whitelist status on
 * @param params.fleetCommanderAddress The FleetCommander contract address
 * @param params.account The address to check for whitelist status
 */
export const isWhitelistedHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    fleetCommanderAddress,
    account,
  }: {
    chainId: ChainId
    fleetCommanderAddress: AddressValue
    account: AddressValue
  }) => {
    return sdk.armada.accessControl.isWhitelisted({ chainId, fleetCommanderAddress, account })
  }
