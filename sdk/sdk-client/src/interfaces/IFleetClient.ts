import { ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'

/**
 * @interface IFleetClient
 * @description Client interface for the Earn Protocol fleets, includes the necessary methods to interact with a fleet
 */
export interface IFleetClient {
  /**
   * @method deposit
   * @description Deposit funds into the fleet for the next cycle
   *
   * @param {IUser} user The user that wants to deposit funds
   * @param {ITokenAmount} amount The amount of funds to deposit
   *
   * @returns {Promise<TransactionInfo[]>} The list of transactions that need to be sent to the blockchain, in the
   *                                       order they need to be sent
   */
  deposit(params: { user: IUser; amount: ITokenAmount }): Promise<TransactionInfo[]>

  /**
   * @method withdraw
   * @description Withdraw funds from the fleet
   *
   * @param {IUser} user The user that wants to withdraw funds
   * @param {ITokenAmount} amount The amount of funds to withdraw
   *
   * @returns {Promise<TransactionInfo[]} The list of transactions that need to be sent to the blockchain, in the
   *                                      order they need to be sent
   */
  withdraw(params: { user: IUser; amount: ITokenAmount }): Promise<TransactionInfo[]>
}
