import { ImportingSimulationManager, MigrationSimulationManager } from '~sdk/managers'
import { ExternalPosition, ImportPositionSimulation } from '~sdk/orders'

/**
 * @class ImportingSimulationManagerMixin
 * @description Client implementation of the AutomationSimulationManager interface
 * @see ImportingSimulationManager
 */
export abstract class ImportingSimulationManagerMixin implements ImportingSimulationManager {
  /// Instance Methods

  /**
   * @method simulateImportPosition
   * @see MigrationSimulationManager#simulateImportPosition
   */
  public async simulateImportPosition(params: {
    externalPosition: ExternalPosition
  }): Promise<ImportPositionSimulation> {
    // TODO: Implement
    return {} as ImportPositionSimulation
  }
}
