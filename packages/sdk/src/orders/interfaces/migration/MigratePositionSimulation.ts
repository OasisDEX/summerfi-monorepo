import { Simulation, SimulationType } from '~sdk/orders'

interface MigratePositionSimulationData {

}

/**
 * @interface MigratePositionSimulation
 * @description Simulation data for migrating a position.
 */
export type MigratePositionSimulation = Simulation<SimulationType.Migrate, MigratePositionSimulationData>
