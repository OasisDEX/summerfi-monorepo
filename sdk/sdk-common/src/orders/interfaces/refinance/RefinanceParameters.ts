import { Position } from '~sdk-common/users'
import { Pool } from '~sdk-common/protocols'
import { Percentage } from '~sdk-common/common'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  sourcePosition: Position
  targetPool: Pool
  slippage: Percentage
}
