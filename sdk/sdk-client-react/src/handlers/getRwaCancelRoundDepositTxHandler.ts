import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type { AddressValue, ChainId, RoundsVaultType } from '@summerfi/sdk-common'

export const getRwaCancelRoundDepositTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fleetAddress,
    chainId,
    userAddress,
    roundId,
    amount,
    receiverAddress,
    vaultType,
  }: {
    fleetAddress: AddressValue
    chainId: ChainId
    userAddress: AddressValue
    roundId: bigint
    amount: string
    receiverAddress?: AddressValue
    vaultType: RoundsVaultType
  }) => {
    return sdk.rwa.getCancelRoundDepositTx({
      chainId,
      fleetAddress,
      userAddress,
      roundId,
      amount,
      receiverAddress,
      vaultType,
    })
  }
