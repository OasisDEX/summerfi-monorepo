import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

/** @see IRwaManagerClient.getDepositTx */
export const getRwaDepositTxHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    userAddress,
    assetsAmount,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    userAddress: AddressValue
    assetsAmount: string
  }) => {
    return sdk.rwa.getDepositTx({ chainId, fleetAddress, userAddress, assetsAmount })
  }
