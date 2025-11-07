import { IAddress, TransactionInfo } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'
import { IErc20Contract } from './IErc20Contract'
import { IErc4626Contract } from './IErc4626Contract'

/**
 * @name IFleetCommanderWhitelistedContract
 * @description Interface for the FleetCommanderWhitelisted contract wrapper
 */
export interface IFleetCommanderWhitelistedContract extends IContractWrapper {
  /** WRITE METHODS */

  /**
   * @name setWhitelisted
   * @description Sets the whitelist status for an account
   *
   * @param account The address to set whitelist status for
   * @param allowed Whether the account should be whitelisted
   *
   * @returns The transaction information
   */
  setWhitelisted(params: { account: IAddress; allowed: boolean }): Promise<TransactionInfo>

  /**
   * @name setWhitelistedBatch
   * @description Sets the whitelist status for multiple accounts.
   *
   * @param accounts The list of addresses to set whitelist status for
   * @param allowed The list of whitelist statuses for each account
   *
   * @returns The transaction information
   */
  setWhitelistedBatch(params: {
    accounts: IAddress[]
    allowed: boolean[]
  }): Promise<TransactionInfo>

  /** READ METHODS */

  /**
   * @name isWhitelisted
   * @description Returns whether an account is whitelisted
   *
   * @param account The address to check
   *
   * @returns True if the account is whitelisted, false otherwise
   */
  isWhitelisted(params: { account: IAddress }): Promise<boolean>

  /** CASTING METHODS */

  /**
   * @name asErc20
   * @description Returns the contract as an ERC20 contract
   */
  asErc20(): IErc20Contract

  /**
   * @name asErc4626
   * @description Returns the contract as an ERC4626 contract
   */
  asErc4626(): IErc4626Contract
}
