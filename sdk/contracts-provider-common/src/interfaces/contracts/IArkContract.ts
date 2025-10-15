import { type IArkConfig } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'

/**
 * @name IArkContract
 * @description Interface for the Ark contract wrapper
 */
export interface IArkContract extends IContractWrapper {
  /** READ METHODS */

  /**
   * @name config
   * @description Returns the configuration of the fleet
   */
  config(): Promise<IArkConfig>
}
