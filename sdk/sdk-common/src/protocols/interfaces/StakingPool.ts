import { Token } from '~sdk-common/common'
import { IPool } from './IPool'

/**
 * @interface StakingPool
 * @description Represents a staking pool. Provides information about the staking token
 */
export interface StakingPool extends IPool {
  stakingToken: Token
}
