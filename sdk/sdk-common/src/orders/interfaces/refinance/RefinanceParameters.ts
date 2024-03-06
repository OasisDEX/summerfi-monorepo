import { Percentage } from '../../../common/implementation/Percentage'
import { Position } from '../../../common/implementation/Position'
import { LendingPool } from '../../../protocols/implementation/LendingPool'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  sourcePosition: Position
  targetPool: LendingPool
  slippage: Percentage
}

export function isRefinanceParameters(parameters: unknown): parameters is RefinanceParameters {
  return typeof parameters === 'object' && parameters !== null && 'slippage' in parameters
}
