import { Simulation, SimulationType } from '~sdk/orders'

/**
 * @interface RefinanceSimulation
 * @description Simulation data for refinancing a position.
 */
export type RefinanceSimulation = Simulation<SimulationType.Refinance>
