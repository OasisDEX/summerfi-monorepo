import { TokenAmount } from '~sdk/common'
import { Simulation, SimulationType } from '~sdk/orders'
import { Swap } from '~sdk/exchange'
import { Position } from '~sdk'

interface RefinanceSimulationData {
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
export type RefinanceSimulation = Simulation<SimulationType.Refinance, RefinanceSimulationData>
