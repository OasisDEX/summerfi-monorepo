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

  /**
   * @name convertToAssets
   * @description Converts the provided shares amount to assets
   *
   * @param amount The amount to convert
   *
   * @returns The amount converted to assets
   */
  convertToAssets(params: { amount: ITokenAmount }): Promise<ITokenAmount>

  /**
   * @name convertToShares
   * @description Converts the provided underlying amount to shares
   *
   * @param amount The amount to convert
   *
   * @returns The amount converted to shares
   */
  convertToShares(params: { amount: ITokenAmount }): Promise<ITokenAmount>

  /**
   * @name previewDeposit
   * @description Previews the deposit of the provided amount into the vault
   *
   * @param assets The amount to deposit
   *
   * @returns The amount that will be received
   */
  previewDeposit(params: { assets: ITokenAmount }): Promise<ITokenAmount>

  /**
   * @name previewWithdraw
   * @description Previews the withdrawal of the provided amount from the vault
   *
   * @param assets The amount to withdraw
   *
   * @returns The amount that will be received
   */
  previewWithdraw(params: { assets: ITokenAmount }): Promise<ITokenAmount>

  /**
   * @name previewRedeem
   * @description Previews the redemption of the provided amount of shares
   *
   * @param shares The amount of shares to redeem
   *
   * @returns The amount that will be received
   */
  previewRedeem(params: { shares: ITokenAmount }): Promise<ITokenAmount>

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
