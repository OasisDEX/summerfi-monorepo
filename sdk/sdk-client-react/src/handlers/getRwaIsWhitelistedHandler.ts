import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaIsWhitelistedHandler =
  (sdk: ISDKInstiManager) =>
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
