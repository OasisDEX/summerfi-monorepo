import { ISimulation } from '../../../simulation/interfaces/ISimulation'
import { TransactionInfo } from './TransactionInfo'

/**
 * @interface Order
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Order {
  /** @description Simulation */
  simulation: ISimulation
  /** @description Transaction info */
  transactions: TransactionInfo[]
}
