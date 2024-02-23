import { Pool } from '~sdk-common/protocols'
import { Percentage, type Position } from '~sdk-common/common'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  sourcePosition: Position
  targetPool: Pool
  slippage: Percentage
}
