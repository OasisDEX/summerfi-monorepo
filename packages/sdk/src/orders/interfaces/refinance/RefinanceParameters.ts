import { Position } from '~sdk/users'
import { Pool } from '~sdk/protocols'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  sourcePosition: Position
  targetPool: Pool
}
