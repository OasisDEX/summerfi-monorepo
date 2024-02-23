import type { Position } from '~sdk-common/common'
import { MigratePositionParameters, MigratePositionSimulation } from '~sdk-common/orders'

/**
 * @interface MigrationSimulationManager
 * @description Simulations for migration operations
 */
export interface MigrationSimulationManager {
  /**
   * @function simulateMigratePosition
   * @description Simulates the migration of a position
   *
   * @param position Position to migrate
   * @param parameters Parameters used to migrate the position
   *
   * @returns Simulation data for the migration of a position
   */
  simulateMigratePosition(params: {
    position: Position
    parameters?: MigratePositionParameters
  }): Promise<MigratePositionSimulation>
}
