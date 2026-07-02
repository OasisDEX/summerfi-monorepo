import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { ChainId, AddressValue } from '@summerfi/sdk-common'

/**
 * Checks if an address is whitelisted in the FleetCommander contract
 *
 * @param params.chainId The chain ID to check the whitelist status on
 * @param params.fleetCommanderAddress The FleetCommander contract address
 * @param params.targetAddress The address to check for whitelist status
 */
export const isWhitelistedHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    chainId,
    fleetCommanderAddress,
    targetAddress,
  }: {
    chainId: ChainId
    fleetCommanderAddress: AddressValue
    targetAddress: AddressValue
  }) => {
    return sdk.armada.accessControl.isWhitelisted({ chainId, fleetCommanderAddress, targetAddress })
  }
