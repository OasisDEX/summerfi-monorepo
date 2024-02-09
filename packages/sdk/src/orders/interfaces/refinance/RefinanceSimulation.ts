import { TokenAmount } from '~sdk/common'
import { SimulationData, SimulatedStrategy } from '~sdk/orders'
import { Swap } from '~sdk/exchange'

/**
 * @interface RefinanceSimulation
 * @description Simulation data for refinancing a position.
 */
export interface RefinanceSimulation extends SimulationData {
  simulatedStrategy: SimulatedStrategy.Refinance
  flashLoan: TokenAmount
  debtSwap?: Swap
  collateralSwap?: Swap
}
