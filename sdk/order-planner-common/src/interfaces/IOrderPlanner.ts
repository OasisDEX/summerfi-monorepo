import { Maybe, Order, SimulationType } from '@summerfi/sdk-common'
import { BuildOrderParams } from '../types/BuildOrderParams'

/**
 * @name IOrderPlanner
 * @description Component that transforms a simulation into an Order, including the necessary transactions to
 *              execute them
 */
export interface IOrderPlanner {
  /**
   * Builds an order from a simulation
   * @see OrderPlannerParams
   */
  buildOrder(params: BuildOrderParams): Promise<Maybe<Order>>

  /**
   * Get the list of accepted simulations for the order planner
   */
  getAcceptedSimulations(): SimulationType[]
}
