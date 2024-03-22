import { PoolParameters } from './PoolParameters'
import { AddressValue } from '../../common'
import { CollateralConfig, DebtConfig } from '../../protocols/interfaces/LendingPool'

/**
 * @name LendingPoolParameters
 * @description Represents the parameters of a lending pool
 */
export type LendingPoolParameters<
  CollateralConfigType extends CollateralConfig = CollateralConfig,
  DebtConfigType extends DebtConfig = DebtConfig,
> = PoolParameters & {
  debts: Record<AddressValue, DebtConfigType>
  collaterals: Record<AddressValue, CollateralConfigType>
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
