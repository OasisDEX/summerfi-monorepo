import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaSetWhitelistedTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
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
