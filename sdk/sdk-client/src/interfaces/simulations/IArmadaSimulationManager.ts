import { IArmadaParameters, IArmadaSimulation } from '@summerfi/armada-protocol-common'

/**
 * Interface for the Armada Protocol Simulation Manager
 *
 * The Armada Protocol Simulation Manager is responsible for handling all the simulation related operations
 * for the Armada Protocol. This includes simulations for depositing and withdrawing funds from the Armada Protocol
 * fleets
 */
export interface IArmadaSimulationManager {
  /**
   * Simulate an operation to the Armada Protocol, in particular deposit and withdraw operations
   *
   * @param params Parameters for the Armada Protocol simulation
   *
   * @returns The simulation result
   */
  simulate(params: IArmadaParameters): Promise<IArmadaSimulation>
}
