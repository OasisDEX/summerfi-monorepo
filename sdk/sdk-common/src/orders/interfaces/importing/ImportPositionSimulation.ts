import { Simulation, SimulationType } from '~sdk-common/orders'

/**
 * @interface ImportPositionSimulation
 * @description Simulation data for importing a position from another service
 */
export type ImportPositionSimulation = Simulation<SimulationType.ImportPosition>
