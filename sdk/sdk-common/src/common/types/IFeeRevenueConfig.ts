import type { AddressValue } from './AddressValue'
import type { IPercentage } from '../interfaces/IPercentage'

/**
 * Configuration for fee revenue settings
 */
export interface IFeeRevenueConfig {
  /**
   * The address that receives vault fees
   */
  vaultFeeReceiverAddress: AddressValue

  /**
   * The percentage amount of vault fees
   */
  vaultFeeAmount: IPercentage
}
