import { Simulation, SimulationType } from '~sdk-common/orders'

/**
 * @interface MigratePositionSimulation
 * @description Simulation data for migrating a position.
 */
export type MigratePositionSimulation = Simulation<SimulationType.Migrate>
