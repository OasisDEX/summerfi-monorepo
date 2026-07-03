import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

/** @see IRwaManagerClient.getUserVaultExposure */
export const getRwaUserVaultExposureHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    userAddress,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    userAddress: AddressValue
  }) => {
    return sdk.rwa.getUserVaultExposure({ chainId, fleetAddress, userAddress })
  }
