import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaIsWhitelistOpenHandler =
  (sdk: ISDKInstiManager) =>
  async ({ fleetAddress, chainId }: { fleetAddress: AddressValue; chainId: ChainId }) => {
    return sdk.rwa.isWhitelistOpen({ chainId, fleetAddress })
  }
