import { TokenAmount, type Position } from '~sdk-common/common/implementation'
import { Simulation, SimulationType } from '~sdk-common/orders'
import { Swap } from '~sdk-common/exchange'

export interface RefinanceSimulationData {
  sourcePosition: Position
  targetPosition: Position
  flashLoan: TokenAmount
  debtSwap?: Swap
  collateralSwap?: Swap
}

/**
 * @interface RefinanceSimulation
 * @description Simulation data for refinancing a position.
 */
export type RefinanceSimulation = Simulation<SimulationType.Refinance>
