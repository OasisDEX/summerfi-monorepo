import { RefinanceParameters, RefinanceSimulation } from '~sdk-common/orders'
import { Pool } from '~sdk-common/protocols'
import { Position } from '~sdk-common/users'

/**
 * @interface RefinanceSimulationManager
 * @description Simulations for refinance operations
 */
export interface RefinanceSimulationManager {
  /**
   * @function simulateRefinancePosition
   * @description Simulates a refinance operation
   *
   * @param position Position to refinance
   * @param parameters Parameters used to refinance the position
   *
   * @returns Simulation data for a refinance operation
   */
  simulateRefinancePosition(params: {
    position: Position
    pool: Pool
    parameters: RefinanceParameters
  }): Promise<RefinanceSimulation>
}
