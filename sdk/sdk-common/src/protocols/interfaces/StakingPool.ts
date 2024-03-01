import { Token } from '~sdk-common/common/implementation/Token'
import { IPool } from './IPool'
import { PoolType } from './PoolType'

/**
 * @interface StakingPool
 * @description Represents a staking pool. Provides information about the staking token
 */
export interface StakingPool extends IPool {
  type: PoolType.Staking
  stakingToken: Token
}
