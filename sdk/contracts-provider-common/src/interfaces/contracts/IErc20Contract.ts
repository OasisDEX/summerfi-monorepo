import { IAddress, IToken, ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'

/**
 * @name IErc20Contract
 * @description Interface for the ERC20 contract wrapper
 */
export interface IErc20Contract extends IContractWrapper {
  /** READ METHODS */

  /**
   * @name getToken
   * @description Returns the token associated with the ERC20 contract
   */
  getToken(): Promise<IToken>

  /**
   * @name balanceOf
   * @description Returns the balance of the provided address
   */
  balanceOf(params: { address: IAddress }): Promise<ITokenAmount>

  /**
   * @name allowance
   * @description Returns the allowance of the owner to the spender
   */
  allowance(params: { owner: IAddress; spender: IAddress }): Promise<ITokenAmount>

  /** WRITE METHODS */

  /**
   * Allows a spender to transfer funds from the caller's account
   * @param spender The address that will be allowed to spend the caller's funds
   * @param amount The amount that the spender will be allowed to spend
   */
  approve(params: { spender: IAddress; amount: ITokenAmount }): Promise<TransactionInfo>
}
