import { MigrationSimulationManager } from '~sdk/managers'
import { MigratePositionParameters, MigratePositionSimulation } from '~sdk/orders'
import { Position } from '~sdk/user'

/**
 * @class FinanceSimulationManagerClientImpl
 * @description Client implementation of the AutomationSimulationManager interface
 * @see MigrationSimulationManager
 */
export abstract class MigrationSimulationManagerClientImpl implements MigrationSimulationManager {
  /// Instance Methods

  /**
   * @method simulateMigratePosition
   * @see MigrationSimulationManager#simulateMigratePosition
   */
  public async simulateMigratePosition(params: {
    position: Position
    parameters?: MigratePositionParameters
  }): Promise<MigratePositionSimulation> {
    // TODO: Implement
    return {} as MigratePositionSimulation
  }
}
