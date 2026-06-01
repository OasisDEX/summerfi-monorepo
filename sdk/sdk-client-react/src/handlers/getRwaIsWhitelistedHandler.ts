import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaIsWhitelistedHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    accountAddress,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    accountAddress: AddressValue
  }) => {
    return sdk.rwa.isWhitelisted({ chainId, fleetAddress, accountAddress })
  }
