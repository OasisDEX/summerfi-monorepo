import { Token } from '~sdk/common'
import { PoolParameters } from '~sdk/protocols'

/**
 * @name LendingPoolParameters
 * @description Represents the parameters of a lending pool
 */
export type LendingPoolParameters = PoolParameters & {
  debtToken: Token
  collateralToken: Token
}
