import { Token } from '~sdk-common/common/implementation'
import { PoolParameters } from '~sdk-common/protocols'

/**
 * @name SupplyPoolParameters
 * @description Represents the parameters of a supply pool
 */
export type SupplyPoolParameters = PoolParameters & {
  stakingToken: Token
}
