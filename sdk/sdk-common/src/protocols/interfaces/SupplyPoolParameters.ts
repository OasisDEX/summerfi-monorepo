import { Token } from '~sdk-common/common/implementation/Token'
import type { PoolParameters } from '~sdk-common/protocols/interfaces/PoolParameters'

/**
 * @name SupplyPoolParameters
 * @description Represents the parameters of a supply pool
 */
export type SupplyPoolParameters = PoolParameters & {
  stakingToken: Token
}
