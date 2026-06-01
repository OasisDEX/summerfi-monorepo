import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaIsWhitelistOpenHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({ fleetAddress, chainId }: { fleetAddress: AddressValue; chainId: ChainId }) => {
    return sdk.rwa.isWhitelistOpen({ chainId, fleetAddress })
  }
