import type { AddressValue } from './AddressValue'
import type { IPercentage } from '../interfaces/IPercentage'

/**
 * @name IFeeRevenueConfig
 * @description Configuration for fee revenue settings
 */
export interface IFeeRevenueConfig {
  /**
   * @name vaultFeeReceiverAddress
   * @description The address that receives vault fees
   */
  vaultFeeReceiverAddress: AddressValue

  /**
   * @name vaultFeeAmount
   * @description The percentage amount of vault fees
   */
  vaultFeeAmount: IPercentage
}
