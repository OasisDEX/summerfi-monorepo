import { PoolParameters } from './PoolParameters'
import { ICollateralConfigMap } from '../interfaces/ICollateralConfigMap'
import { IDebtConfigMap } from '../interfaces/IDebtConfigMap'

/**
 * @name LendingPoolParameters
 * @description Represents the parameters of a lending pool
 */
export type LendingPoolParameters = PoolParameters & {
  debts: IDebtConfigMap
  collaterals: ICollateralConfigMap
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
    'debts' in poolParameters &&
    'collaterals' in poolParameters
  )
}
