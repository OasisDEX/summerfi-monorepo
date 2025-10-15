import type { IAddress } from '../interfaces/IAddress'
import type { ITokenAmount } from '../interfaces/ITokenAmount'

/**
 * @name IFleetConfig
 * @description Data structure for rebalancing assets, used by Keepers of a fleet
 */
export interface IFleetConfig {
  /** The address of the buffer Ark associated with this Fleet */
  readonly bufferArk: IAddress
  /** The minimum balance that should be maintained in the buffer Ark */
  readonly minimumBufferBalance: ITokenAmount
  /** The maximum total value of assets that can be deposited into the fleet */
  readonly depositCap: ITokenAmount
  /** The maximum number of rebalance operations that can be performed in a single rebalance transaction */
  readonly maxRebalanceOperations: string
  /** The address of the staking rewards manager contract */
  readonly stakingRewardsManager: IAddress
}
