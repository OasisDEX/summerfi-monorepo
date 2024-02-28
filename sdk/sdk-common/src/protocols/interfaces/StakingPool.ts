import { Token } from '~sdk-common/common/implementation'
import { IPool, PoolType } from './IPool'

/**
 * @interface StakingPool
 * @description Represents a staking pool. Provides information about the staking token
 */
export interface StakingPool extends IPool {
  type: PoolType.Staking
  stakingToken: Token
}
