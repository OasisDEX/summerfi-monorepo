import { IRefinanceParameters, IRefinanceSimulation } from '@summerfi/sdk-common'

/**
 * Interface for the Refinance Simulation Manager
 *
 * The Refinance Simulation Manager is responsible for handling all the simulation related operations
 * for refinancing a position in the Summer system. This is moving a position from one product to another in one step.
 * This may include changing the underlying protocol, the collateral, the leverage, etc.
 */
export interface IRefinanceSimulationManager {
  /**
   * Simulate the refinance of a position
   *
   * @param refinanceParameters Parameters for the refinance position simulation, @see IRefinanceParameters
   *
   * @returns The simulation result
   *
   * TODO: rename the method to `simulate`
   */
  simulateRefinancePosition(
    refinanceParameters: IRefinanceParameters,
  ): Promise<IRefinanceSimulation>
}
