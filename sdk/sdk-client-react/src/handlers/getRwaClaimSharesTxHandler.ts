import type { ISDKInstiManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

export const getRwaClaimSharesTxHandler =
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
    return sdk.rwa.getClaimSharesTx({
      chainId,
      fleetAddress,
      userAddress,
      roundId,
      amount,
      receiverAddress,
    })
  }
