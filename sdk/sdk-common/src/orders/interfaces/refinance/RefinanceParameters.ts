import type { Percentage } from '~sdk-common/common/implementation/Percentage'
import type { Position } from '~sdk-common/common/implementation/Position'
import type { LendingPool } from '~sdk-common/protocols/interfaces/LendingPool'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  sourcePosition: Position
  targetPool: LendingPool
  slippage: Percentage
}
