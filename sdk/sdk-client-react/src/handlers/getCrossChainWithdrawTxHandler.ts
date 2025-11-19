import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type {
  ChainId,
  IArmadaVaultId,
  IPercentage,
  ITokenAmount,
  IUser,
} from '@summerfi/sdk-common'

/**
 * @name getCrossChainWithdrawTxHandler
 * @description Generates transactions needed to withdraw tokens cross-chain from a Fleet using Enso routing
 * @param params.vaultId ID of the pool to withdraw from
 * @param params.user user that is trying to withdraw
 * @param params.amount Token amount to be withdrawn
 * @param params.slippage Maximum slippage allowed for the operation
 * @param params.toChainId Destination chain ID where user wants to receive tokens
 */
export const getCrossChainWithdrawTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    vaultId,
    user,
    amount,
    slippage,
    toChainId,
  }: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    toChainId: ChainId
  }) => {
    const transactions = await sdk.armada.users.getCrossChainWithdrawTx({
      vaultId,
      user,
      amount,
      slippage,
      toChainId,
    })
    return transactions
  }
