import type { Percentage } from '../../../common/implementation/Percentage'
import type { Position } from '../../../common/implementation/Position'
import type { Address } from '../../../common/implementation/Address'
import type { LendingPool } from '../../../protocols/implementation/LendingPool'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  position: Position
  targetPool: LendingPool
  targetCollateral: Address
  targetDebt: Address
  slippage: Percentage
}

export function isRefinanceParameters(parameters: unknown): parameters is RefinanceParameters {
  return typeof parameters === 'object' && parameters !== null && 'slippage' in parameters
}
