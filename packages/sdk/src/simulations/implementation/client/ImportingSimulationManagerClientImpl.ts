import { ImportingSimulationManager } from '~sdk/simulations'
import { ExternalPosition, ImportPositionSimulation } from '~sdk/orders'

export class ImportingSimulationManagerClientImpl implements ImportingSimulationManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async simulateImportPosition(params: {
    externalPosition: ExternalPosition
  }): Promise<ImportPositionSimulation> {
    // TODO: Implement
    return {} as ImportPositionSimulation
  }
}
