import { Pool } from '~sdk-common/protocols'
import { Percentage, type Position } from '~sdk-common/common/implementation'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  sourcePosition: Position
  targetPool: Pool
  slippage: Percentage
}

export function isRefinanceParameters(parameters: unknown): parameters is RefinanceParameters {
  return typeof parameters === 'object' && parameters !== null && 'slippage' in parameters
}
