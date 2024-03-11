import {AddressValue} from "~sdk-common/common";
import type { Token } from '~sdk-common/common/implementation/Token'
import {CollateralConfig, DebtConfig} from "~sdk-common/protocols";
import type { PoolParameters } from '~sdk-common/protocols/interfaces/PoolParameters'

/**
 * @name LendingPoolParameters
 * @description Represents the parameters of a lending pool
 */
export type LendingPoolParameters<GenericCollateralConfig extends CollateralConfig = CollateralConfig, GenericDebtConfig extends DebtConfig = DebtConfig> = PoolParameters & {
  debts: Record<AddressValue, GenericDebtConfig>
  collaterals: Record<AddressValue, GenericCollateralConfig>
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
