import { IEarnProtocolSimulation } from '@summerfi/sdk-common'
import { IEarnProtocolParameters } from '@summerfi/sdk-common/orders/earn-protocol'
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
  simulate(params: IEarnProtocolParameters): Promise<IEarnProtocolSimulation>
}
