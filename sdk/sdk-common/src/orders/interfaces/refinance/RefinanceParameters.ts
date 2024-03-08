import type { Percentage } from '../../../common/implementation/Percentage'
import type { Position } from '../../../common/implementation/Position'
import type { LendingPool } from '../../../protocols/interfaces/LendingPool'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  position: Position
  targetPool: LendingPool
  slippage: Percentage
}

export function isRefinanceParameters(parameters: unknown): parameters is RefinanceParameters {
  return typeof parameters === 'object' && parameters !== null && 'slippage' in parameters
}
