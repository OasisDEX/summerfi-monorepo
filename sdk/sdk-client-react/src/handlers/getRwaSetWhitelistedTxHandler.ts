import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaSetWhitelistedTxHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    accountAddress,
    allowed,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    accountAddress: AddressValue
    allowed: boolean
  }) => {
    return sdk.rwa.getSetWhitelistedTx({ chainId, fleetAddress, accountAddress, allowed })
  }
