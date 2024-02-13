import { Position } from '~sdk/users'
import { Pool } from '~sdk/protocols'
import { Percentage } from '~sdk/common'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  sourcePosition: Position
  targetPool: Pool
  slippage: Percentage
}
