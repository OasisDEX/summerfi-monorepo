import { Token } from '~sdk/common'
import { Pool } from './Pool'

/**
 * @interface StakingPool
 * @description Represents a staking pool. Provides information about the staking token
 */
export interface StakingPool extends Pool {
  stakingToken: Token
}
