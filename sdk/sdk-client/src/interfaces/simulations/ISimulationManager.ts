import { IImportingSimulationManager } from './IImportingSimulationManager'
import { IRefinanceSimulationManager } from './IRefinanceSimulationManager'

/**
 * Interface for the Simulation Manager
 *
 * The Simulation Manager is responsible for handling all the simulation related operations
 * and returning the results of the simulation that can be used to display the results to the user
 * and also to generate an order to execute the simulation
 */
export interface ISimulationManager {
  /** Finance related simulations, i.e.: Earn + Multriply + Borrow */
  readonly finance: undefined
  /** Refinance related simulations: moving a position from one product to another in one step */
  readonly refinance: IRefinanceSimulationManager
  /** Automation triggers simulation */
  readonly automation: undefined
  /** Importing simulation: ingressing an external position into the Summer system */
  readonly importing: IImportingSimulationManager
  /** Earn Protocol simulations */
  readonly earn: undefined
}
