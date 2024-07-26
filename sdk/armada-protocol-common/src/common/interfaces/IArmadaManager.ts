import { IAddress, IChainInfo, ITokenAmount } from '@summerfi/sdk-common/common'
import { TransactionInfo } from '@summerfi/sdk-common/orders'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * @name IArmadaManager
 * @description Interface for the Armada Protocol Manager which handles generating transactions for a Fleet
 */
export interface IArmadaManager {
  /**
   * @name deposit
   * @description Deposit tokens into the Fleet
   *
   * @param chainInfo Chain in which the fleet is
   * @param fleetAddress Address of the entry point contract for the Fleet
   * @param user Address of the user that is trying to deposit
   * @param amount Token amount to be deposited
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  deposit(params: {
    chainInfo: IChainInfo
    fleetAddress: IAddress
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>

  /**
   * @name withdraw
   * @description Withdraw tokens from the Fleet
   *
   * @param chainInfo Chain in which the fleet is
   * @param fleetAddress Address of the entry point contract for the Fleet
   * @param user Address of the user that is trying to withdraw
   * @param amount Token amount to be withdrawn
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  withdraw(params: {
    chainInfo: IChainInfo
    fleetAddress: IAddress
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>
}
