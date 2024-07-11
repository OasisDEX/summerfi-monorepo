import type { IAddress, IChainInfo, ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'

/**
 * @name IAllowanceManager
 * @description Interface for the Earn Protocol Manager which handles generating transactions for a Fleet
 */
export interface IAllowanceManager {
  /**
   * @name getAllowance
   * @description Deposit tokens into the Fleet
   *
   * @param chainInfo Chain in which the token is
   * @param tokenAddress Address of the token for the allowance
   * @param user Address of the user that is trying to set the allowance
   * @param amount Amount of tokens to set the allowance
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getAllowance(params: {
    chainInfo: IChainInfo
    fleetAddress: IAddress
    tokenAddress: IAddress
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>
}
