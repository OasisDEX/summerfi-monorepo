import { SimulationData } from './SimulationData'
import { TransactionInfo } from './TransactionInfo'

/**
 * @interface Simulation
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Simulation {
  /** @description Simulation data */
  simulationData: SimulationData
  /** @description Transaction info */
  transactions: TransactionInfo[]
}
