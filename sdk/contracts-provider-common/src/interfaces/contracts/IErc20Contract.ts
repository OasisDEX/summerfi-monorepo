import { IAddress, IToken, ITokenAmount } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'

/**
 * @name IErc20Contract
 * @description Interface for the ERC20 contract wrapper
 */
export interface IErc20Contract extends IContractWrapper {
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
}
