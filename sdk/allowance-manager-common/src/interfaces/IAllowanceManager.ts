import type {
  ApproveTransactionInfo,
  IAddress,
  IChainInfo,
  ITokenAmount,
} from '@summerfi/sdk-common'

/**
 * @name IAllowanceManager
 * @description Interface for the Allowance Manager which handles generating transactions for setting an allowance
 */
export interface IAllowanceManager {
  /**
   * @name getApproval
   * @description Get the transactions needed to set an allowance for a token
   *
   * @param chainInfo Chain in which the token is
   * @param spender Address of the spender to approve
   * @param amount Amount of tokens to allow the spender to spend
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getApproval(params: {
    chainInfo: IChainInfo
    spender: IAddress
    amount: ITokenAmount
    owner?: IAddress
  }): Promise<ApproveTransactionInfo | undefined>
}
