import { Simulation, SimulationType } from '~sdk-common/orders'

/**
 * @interface RefinanceSimulation
 * @description Simulation data for refinancing a position.
 */
export type RefinanceSimulation = Simulation<SimulationType.Refinance>
