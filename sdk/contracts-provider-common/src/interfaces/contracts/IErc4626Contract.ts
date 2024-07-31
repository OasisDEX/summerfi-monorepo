import { IAddress, IToken, ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'
import { IErc20Contract } from './IErc20Contract'

/**
 * @name IErc4626Contract
 * @description Interface for the ERC4626 contract wrapper
 */
export interface IErc4626Contract extends IContractWrapper {
  /** READ METHODS */

  /**
   * @name asset
   * @description Returns the underlying asset associated with the ERC4626 contract
   */
  asset(): Promise<IToken>

  /**
   * @name totalAssets
   * @description Returns the total number of assets available in the vault
   */
  totalAssets(): Promise<ITokenAmount>

  /** WRITE METHODS */

  /**
   * @name deposit
   * @description Deposits the provided amount into the vault
   *
   * @param assets The amount to deposit
   * @param receiver The address to receive the funds
   *
   * @returns The transaction information for the given input data
   */
  deposit(params: { assets: ITokenAmount; receiver: IAddress }): Promise<TransactionInfo>

  /**
   * @name withdraw
   * @description Withdraws the provided amount from the vault
   *
   * @param assets The amount to withdraw
   * @param receiver The address to receive the funds
   * @param owner The address of the owner
   *
   * @returns The transaction information for the given input data
   */
  withdraw(params: {
    assets: ITokenAmount
    receiver: IAddress
    owner: IAddress
  }): Promise<TransactionInfo>

  /** CONVERSION METHODS */

  /**
   * @name asErc20
   * @description Returns the contract as an ERC20 contract
   */
  asErc20(): IErc20Contract
}
