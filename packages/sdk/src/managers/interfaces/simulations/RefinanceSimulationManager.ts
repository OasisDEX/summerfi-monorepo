import { RefinanceParameters, RefinanceSimulation } from '~sdk/orders'
import { Pool } from '~sdk/protocols'
import { Position } from '~sdk/user'

/**
 * @interface RefinanceSimulationManager
 * @description Simulations for refinance operations
 */
export interface RefinanceSimulationManager {
  /**
   * @function simulateRefinance
   * @description Simulates a refinance operation
   *
   * @param position Position to refinance
   * @param parameters Parameters used to refinance the position
   *
   * @returns Simulation data for a refinance operation
   */
  simulateRefinance(params: {
    position: Position
    pool: Pool
    parameters: RefinanceParameters
  }): Promise<RefinanceSimulation>
}
