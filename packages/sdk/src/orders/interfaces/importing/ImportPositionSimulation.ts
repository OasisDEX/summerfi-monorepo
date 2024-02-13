import { Simulation, SimulationType } from '~sdk/orders'

/**
 * @interface ImportPositionSimulation
 * @description Simulation data for importing a position from another service
 */
export type ImportPositionSimulation = Simulation<SimulationType.ImportPosition, {}>
