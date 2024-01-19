import { AutomationSimulationManager } from '~sdk/managers/interfaces/simulations'
import {
  AddAutomationParameters,
  AddAutomationSimulation,
  AutomationId,
  RemoveAutomationSimulation,
} from '~sdk/orders'
import { Position } from '~sdk/user'

/**
 * @class AutomationSimulationManagerMixin
 * @description Client implementation of the AutomationSimulationManager interface
 * @see AutomationSimulationManager
 */
export abstract class AutomationSimulationManagerMixin implements AutomationSimulationManager {
  /// Instance Methods

  /**
   * @method simulateAddAutomation
   * @see AutomationSimulationManager#simulateAddAutomation
   */
  public async simulateAddAutomation(params: {
    position: Position
    triggers: AddAutomationParameters
  }): Promise<AddAutomationSimulation> {
    // TODO: Implement
    return {} as AddAutomationSimulation
  }

  /**
   * @method simulateRemoveAutomation
   * @see AutomationSimulationManager#simulateRemoveAutomation
   */
  public async simulateRemoveAutomation(params: {
    id: AutomationId
  }): Promise<RemoveAutomationSimulation> {
    // TODO: Implement
    return {} as RemoveAutomationSimulation
  }
}
