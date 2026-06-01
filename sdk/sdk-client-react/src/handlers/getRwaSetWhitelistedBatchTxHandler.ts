import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaSetWhitelistedBatchTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    accountAddresses,
    allowed,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    accountAddresses: AddressValue[]
    allowed: boolean[]
  }) => {
    return sdk.rwa.getSetWhitelistedBatchTx({ chainId, fleetAddress, accountAddresses, allowed })
  }
