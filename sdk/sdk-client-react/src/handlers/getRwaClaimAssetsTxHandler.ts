import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

/** @see IRwaManagerClient.getClaimAssetsTx */
export const getRwaClaimAssetsTxHandler =
  (sdk: ISDKInstiManager) =>
  async ({
    fleetAddress,
    chainId,
    userAddress,
    roundId,
    amount,
    receiverAddress,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    userAddress: AddressValue
    roundId: bigint
    amount: string
    receiverAddress?: AddressValue
  }) => {
    return sdk.rwa.getClaimAssetsTx({
      chainId,
      fleetAddress,
      userAddress,
      roundId,
      amount,
      receiverAddress,
    })
  }
