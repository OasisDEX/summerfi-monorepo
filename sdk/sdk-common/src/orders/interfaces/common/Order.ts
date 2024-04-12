import { ISimulation } from '../../../simulation/Simulation'
import { SimulationType } from '../../../simulation/Enums'
import { TransactionInfo } from './TransactionInfo'

/**
 * @interface Order
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Order {
  /** @description Simulation */
  simulation: ISimulation<SimulationType>
  /** @description Transaction info */
  transactions: TransactionInfo[]
}
