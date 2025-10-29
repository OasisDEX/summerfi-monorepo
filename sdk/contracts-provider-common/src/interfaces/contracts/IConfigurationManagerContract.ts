import { type AddressValue } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'

/**
 * @name IConfigurationManagerContract
 * @description Interface for the ConfigurationManager contract wrapper
 */
export interface IConfigurationManagerContract extends IContractWrapper {
  /** READ METHODS */

  /**
   * @name treasury
   * @description Returns the treasury address
   *
   * @returns Promise<AddressValue> The treasury address
   */
  treasury(): Promise<AddressValue>
}
