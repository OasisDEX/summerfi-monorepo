import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type {
  ChainId,
  IArmadaVaultId,
  IPercentage,
  ITokenAmount,
  AddressValue,
} from '@summerfi/sdk-common'

/**
 * @name getCrossChainDepositTxHandler
 * @description Generates transactions needed to deposit tokens cross-chain into a Fleet using Enso routing
 * @param params.fromChainId Source chain ID where user has tokens
 * @param params.vaultId ID of the pool to deposit in on destination chain
 * @param params.senderAddressValue Address of the user that is sending tokens
 * @param params.receiverAddressValue Optional address to receive the vault shares (defaults to senderAddressValue)
 * @param params.amount Token amount to be deposited from source chain
 * @param params.slippage Maximum slippage allowed for the operation
 */
export const getCrossChainDepositTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fromChainId,
    vaultId,
    senderAddressValue,
    receiverAddressValue,
    amount,
    slippage,
  }: {
    fromChainId: ChainId
    vaultId: IArmadaVaultId
    senderAddressValue: AddressValue
    receiverAddressValue?: AddressValue
    amount: ITokenAmount
    slippage: IPercentage
  }) => {
    const transactions = await sdk.armada.users.getCrossChainDepositTx({
      fromChainId,
      vaultId,
      senderAddressValue,
      receiverAddressValue,
      amount,
      slippage,
    })
    return transactions
  }
