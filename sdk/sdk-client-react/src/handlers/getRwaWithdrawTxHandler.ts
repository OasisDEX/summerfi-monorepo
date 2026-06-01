import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaWithdrawTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    userAddress,
    sharesAmount,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    userAddress: AddressValue
    sharesAmount: string
  }) => {
    return sdk.rwa.getWithdrawTx({ chainId, fleetAddress, userAddress, sharesAmount })
  }
