import { SimulationType } from './SimulationType'

/**
 * @interface Simulation
 * @description Simulation of a position. Specialized into the different types of simulations needed
 */
export interface Simulation<T extends SimulationType, Data> {
  simulationType: T,
  /** @description Simulation data */
  simulationData: Data
}
