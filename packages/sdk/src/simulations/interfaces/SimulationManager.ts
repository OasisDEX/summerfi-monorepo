import {
  AutomationSimulationManager,
  FinanceSimulationManager,
  MigrationSimulationManager,
  RefinanceSimulationManager,
  ImportingSimulationManager,
} from '.'

/**
 * @interface SimulationsManager
 * @description Allows to request different types of simulations:
 *              - Simulation of a position (open, change, close)
 *              - Simulation of a Refinance operation
 *              - Simulation of a Migration operation
 *              - Simulation of an Automation operation
 *              - Simulation of an Import operation
 */
export interface SimulationsManager {
  finance: FinanceSimulationManager
  refinance: RefinanceSimulationManager
  automation: AutomationSimulationManager
  migration: MigrationSimulationManager
  importing: ImportingSimulationManager
}
