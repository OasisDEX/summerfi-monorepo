import { Token } from '~sdk-common/common/implementation/Token'
import type { PoolParameters } from '~sdk-common/protocols/interfaces/PoolParameters'

/**
 * @name StakingPoolParameters
 * @description Represents the parameters of a staking pool
 */
export type StakingPoolParameters = PoolParameters & {
  stakingToken: Token
}
