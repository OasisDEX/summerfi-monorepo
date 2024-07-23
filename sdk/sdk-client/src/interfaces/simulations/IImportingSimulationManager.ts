import { IImportPositionParameters } from '@summerfi/sdk-common/orders/interfaces/importing'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'

/**
 * Interface for the Importing Simulation Manager
 *
 * The Importing Simulation Manager is responsible for handling all the simulation related operations
 * for importing a position into the Summer system. This is ingress an external position (i.e.: EOA owned position or
 * a position on a 3rd party service) into the Summer system.
 */
export interface IImportingSimulationManager {
  /**
   * Simulate the import of a position
   *
   * @param params Parameters for the import position simulation, @see IImportPositionParameters
   *
   * @returns The simulation result
   *
   * TODO: rename the method to `simulate`
   */
  simulateImportPosition(
    params: IImportPositionParameters,
  ): Promise<ISimulation<SimulationType.ImportPosition>>
}
