import { IEarnProtocolParameters } from '@summerfi/sdk-common/orders/interfaces/earn-protocol'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
/**
 * Interface for the Earn Protocol Simulation Manager
 *
 * The Earn Protocol Simulation Manager is responsible for handling all the simulation related operations
 * for the Earn Protocol. This includes simulations for depositing and withdrawing funds from the Earn Protocol
 * fleets
 */
export interface IEarnProtocolSimulationManager {
  /**
   * Simulate an operation to the Earn Protocol, in particular deposit and withdraw operations
   *
   * @param params Parameters for the Earn Protocol simulation
   *
   * @returns The simulation result
   */
  simulate(params: IEarnProtocolParameters): Promise<ISimulation<SimulationType.EarnProtocol>>
}
