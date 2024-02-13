import { Simulation, SimulationType } from '.'
import { TransactionInfo } from './TransactionInfo'

/**
 * @interface Order
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Order {
  /** @description Simulation */
  simulation: Simulation<SimulationType, {}>
  /** @description Transaction info */
  transactions: TransactionInfo[]
}
