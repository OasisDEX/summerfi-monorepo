import { Simulation } from '~sdk-common/simulation/simulation'
import { SimulationType } from '~sdk-common/simulation/enums'
import { TransactionInfo } from './TransactionInfo'

/**
 * @interface Order
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Order {
  /** @description Simulation */
  simulation: Simulation<SimulationType>
  /** @description Transaction info */
  transactions: TransactionInfo[]
}
