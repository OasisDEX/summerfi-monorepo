import { Token } from '~sdk-common/common/implementation'
import { PoolParameters } from '~sdk-common/protocols'

/**
 * @name StakingPoolParameters
 * @description Represents the parameters of a staking pool
 */
export type StakingPoolParameters = PoolParameters & {
  stakingToken: Token
}
