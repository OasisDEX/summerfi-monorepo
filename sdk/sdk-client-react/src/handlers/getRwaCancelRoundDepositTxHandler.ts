import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { ArmadaVaultId, Address, getChainInfoByChainId, RoundsVaultType, User } from '@summerfi/sdk-common'
import type { AddressValue, ChainId } from '@summerfi/sdk-common'

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
    amount: bigint
    receiverAddress?: AddressValue
    vaultType: RoundsVaultType
  }) => {
    const chainInfo = getChainInfoByChainId(chainId)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })
    const user = User.createFromEthereum(chainId, userAddress)
    const receiver = receiverAddress
      ? Address.createFromEthereum({ value: receiverAddress })
      : undefined
    return sdk.rwa.getCancelRoundDepositTx({ vaultId, user, roundId, amount, receiver, vaultType })
  }
