import { ImportingSimulationManager, MigrationSimulationManager } from '~sdk/managers'
import { ExternalPosition, ImportPositionSimulation } from '~sdk/orders'

export class ImportingSimulationManagerClientImpl implements ImportingSimulationManager {
  public async simulateImportPosition(params: {
    externalPosition: ExternalPosition
  }): Promise<ImportPositionSimulation> {
    // TODO: Implement
    return {} as ImportPositionSimulation
  }
}
