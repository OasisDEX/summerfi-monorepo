import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaWithdrawTxHandler =
  (sdk: ISDKInstiManager) =>
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
