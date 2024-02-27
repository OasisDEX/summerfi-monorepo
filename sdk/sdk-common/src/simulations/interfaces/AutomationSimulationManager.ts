import type { Position } from '~sdk-common/common/implementation'
import type {
  AddAutomationParameters,
  AddAutomationSimulation,
  AutomationId,
  RemoveAutomationSimulation,
} from '~sdk-common/orders'

/**
 * @interface AutomationSimulationManager
 * @description Simulations for automation operations
 */
export interface AutomationSimulationManager {
  /**
   * @function simulateAddAutomation
   * @description Simulates the addition of an automation to a position
   *
   * @param position Position to add the automation to
   * @param parameters Parameters used to add the automation to the position
   *
   * @returns Simulation data for the addition of an automation to a position
   */
  simulateAddAutomation(params: {
    position: Position
    triggers: AddAutomationParameters
  }): Promise<AddAutomationSimulation>

  /**
   * @function simulateRemoveAutomation
   * @description Simulates the removal of an automation from a position
   *
   * @param id Id of the automation to remove
   *
   * @returns Simulation data for the removal of an automation from a position
   */
  simulateRemoveAutomation(params: { id: AutomationId }): Promise<RemoveAutomationSimulation>
}
