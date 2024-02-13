import { ExternalPosition, ImportPositionSimulation } from '~sdk/orders'

/**
 * @interface ImportingSimulationManager
 * @description Simulations for importing operations
 */
export interface ImportingSimulationManager {
  /**
   * @function simulate
   * @description Simulates the import of a position
   *
   * @param externalPosition Position to import
   *
   * @returns Simulation data for the import of a position
   */
  simulateImportPosition(params: {
    externalPosition: ExternalPosition
  }): Promise<ImportPositionSimulation>
}
