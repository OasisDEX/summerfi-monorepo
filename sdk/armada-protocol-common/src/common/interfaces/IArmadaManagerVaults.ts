import {
  IArmadaVaultId,
  ITokenAmount,
  IPercentage,
  IUser,
  IToken,
  IArmadaPositionId,
  type ApproveTransactionInfo,
  type WithdrawTransactionInfo,
  type DepositTransactionInfo,
  type VaultSwitchTransactionInfo,
} from '@summerfi/sdk-common'

export interface IArmadaManagerVaults {
  /** USER TRANSACTIONS */

  /**
   * @name getNewDepositTx
   * @description Returns the transactions needed to deposit tokens in the Fleet for a new position
   *
   * @param vaultId ID of the pool to deposit in
   * @param user Address of the user that is trying to deposit
   * @param amount Token amount to be deposited
   * @param slippage Maximum slippage allowed for the operation
   * @param shouldStake Whether the user wants to stake the deposit
   *
   * @returns An array of transactions that must be executed
   */
  getNewDepositTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
  }): Promise<[DepositTransactionInfo] | [ApproveTransactionInfo, DepositTransactionInfo]>

  /**
   * @name getUpdateDepositTx
   * @description Returns the transactions needed to deposit tokens in the Fleet for an existing position
   *
   * @param vaultId ID of the pool to deposit in
   * @param positionId ID of the position to be updated
   * @param amount Token amount to be deposited
   * @param slippage Maximum slippage allowed for the operation
   * @param shouldStake Whether the user wants to stake the deposit
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getUpdateDepositTx(params: {
    vaultId: IArmadaVaultId
    positionId: IArmadaPositionId
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
  }): Promise<[DepositTransactionInfo] | [ApproveTransactionInfo, DepositTransactionInfo]>

  /**
   * @name getWithdrawTx
   * @description Returns the transactions needed to withdraw tokens from the Fleet
   *
   * @param vaultId ID of the pool to withdraw from
   * @param user Address of the user that is trying to withdraw
   * @param amount Token amount to be withdrawn
   * @param slippage Maximum slippage allowed for the operation
   *
   * @returns ExtendedTransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getWithdrawTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<
    | [WithdrawTransactionInfo]
    | [ApproveTransactionInfo, WithdrawTransactionInfo]
    | [ApproveTransactionInfo, ApproveTransactionInfo, WithdrawTransactionInfo]
  >

  /**
   * @name getVaultSwitchTx
   * @description Returns the transactions needed to switch from one vault to another
   *
   * @param sourceVaultId ID of the source pool
   * @param destinationVaultId ID of the destination pool
   * @param user Address of the user that is trying to switch
   * @param amount Token amount to be switched
   * @param slippage Maximum slippage allowed for the operation
   *
   * @returns An array of transactions that must be executed
   */
  getVaultSwitchTx(params: {
    sourceVaultId: IArmadaVaultId
    destinationVaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
  }): Promise<
    | [VaultSwitchTransactionInfo]
    | [ApproveTransactionInfo, VaultSwitchTransactionInfo]
    | [ApproveTransactionInfo, ApproveTransactionInfo, VaultSwitchTransactionInfo]
  >
}
