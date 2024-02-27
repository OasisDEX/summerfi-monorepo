import { Token } from '~sdk-common/common/implementation'
import { PoolParameters } from '~sdk-common/protocols'

/**
 * @name LendingPoolParameters
 * @description Represents the parameters of a lending pool
 */
export type LendingPoolParameters = PoolParameters & {
  debtTokens: Token[]
  collateralTokens: Token[]
}

/**
 * @function isLendingPoolParameters
 * @description Guard for LendingPoolParameters
 *
 * @param poolParameters Pool parameters to check
 *
 * @returns True if the pool parameters are for a lending pool, false otherwise
 */
export function isLendingPoolParameters(
  poolParameters: PoolParameters,
): poolParameters is LendingPoolParameters {
  return (
    typeof poolParameters === 'object' &&
    poolParameters !== null &&
    'debtTokens' in poolParameters &&
    'collateralTokens' in poolParameters
  )
}
