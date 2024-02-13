import { TokenAmount } from '~sdk/common'

/**
 * @interface SimulationData
 * @description Simulation data for an order. To be specialized into the different types of simulations needed
 */
export interface SimulationData {
  // TODO: test
  debtAmount: TokenAmount
  collateralAmount: TokenAmount
}
