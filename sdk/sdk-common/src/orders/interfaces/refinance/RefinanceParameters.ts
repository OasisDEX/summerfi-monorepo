import { Percentage, Position } from '~sdk-common/common/implementation'
import { LendingPool } from '~sdk-common/protocols/interfaces'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  sourcePosition: Position
  targetPool: LendingPool
  slippage: Percentage
}
