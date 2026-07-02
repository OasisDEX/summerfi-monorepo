import { ISimulation } from '../../../simulation/interfaces/ISimulation'
import { TransactionInfo } from './TransactionInfo'

/**
 * Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Order {
  /** Simulation */
  simulation: ISimulation
  /** Transaction info */
  transactions: TransactionInfo[]
}
