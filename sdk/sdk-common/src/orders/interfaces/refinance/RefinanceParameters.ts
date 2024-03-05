import type { Position } from '~sdk-common/common/implementation/Position'
import type { LendingPool } from '~sdk-common/protocols/interfaces/LendingPool'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  position: Position
  targetPool: LendingPool
  slippage: number // TODO: to percentage
}

export function isRefinanceParameters(parameters: unknown): parameters is RefinanceParameters {
  return typeof parameters === 'object' && parameters !== null && 'slippage' in parameters
}
