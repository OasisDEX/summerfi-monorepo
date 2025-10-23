import { type AddressValue, TransactionInfo } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'

/**
 * @name IAdmiralsQuartersContract
 * @description Interface for the AdmiralsQuarters contract wrapper
 */
export interface IAdmiralsQuartersContract extends IContractWrapper {
  /** READ METHODS */

  /**
   * @name isWhitelisted
   * @description Checks if an address is whitelisted
   *
   * @param account The address to check for whitelist status
   *
   * @returns Promise<boolean> True if the address is whitelisted
   */
  isWhitelisted(params: { account: AddressValue }): Promise<boolean>

  /** WRITE METHODS */

  /**
   * @name setWhitelisted
   * @description Sets the whitelist status for an address
   *
   * @param account The address to set the whitelist status for
   * @param allowed The whitelist status to set
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  setWhitelisted(params: { account: AddressValue; allowed: boolean }): Promise<TransactionInfo>

  /**
   * @name setWhitelistedBatch
   * @description Sets the whitelist status for multiple addresses
   *
   * @param accounts The addresses to set the whitelist status for
   * @param allowed The whitelist statuses to set (must match the length of accounts)
   *
   * @returns Promise<TransactionInfo> The transaction information
   */
  setWhitelistedBatch(params: {
    accounts: AddressValue[]
    allowed: boolean[]
  }): Promise<TransactionInfo>
}
