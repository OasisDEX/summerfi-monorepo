import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import type {
  ChainId,
  IArmadaVaultId,
  IPercentage,
  ITokenAmount,
  IUser,
} from '@summerfi/sdk-common'

/**
 * @name getCrossChainDepositTxHandler
 * @description Generates transactions needed to deposit tokens cross-chain into a Fleet using Enso routing
 * @param params.fromChainId Source chain ID where user has tokens
 * @param params.vaultId ID of the pool to deposit in on destination chain
 * @param params.user user that is trying to deposit
 * @param params.amount Token amount to be deposited from source chain
 * @param params.slippage Maximum slippage allowed for the operation
 * @param params.shouldStake Whether the user wants to stake the deposit
 * @param params.referralCode Optional referral code
 */
export const getCrossChainDepositTxHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    fromChainId,
    vaultId,
    user,
    amount,
    slippage,
    referralCode,
  }: {
    fromChainId: ChainId
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    referralCode?: string
  }) => {
    const transactions = await sdk.armada.users.getCrossChainDepositTx({
      fromChainId,
      vaultId,
      user,
      amount,
      slippage,
      referralCode,
    })
    return transactions
  }
