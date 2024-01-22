import { AutomationSimulationManager } from '~sdk/managers/interfaces/simulations'
import {
  AddAutomationParameters,
  AddAutomationSimulation,
  AutomationId,
  RemoveAutomationSimulation,
} from '~sdk/orders'
import { Position } from '~sdk/user'

export class AutomationSimulationManagerClientImpl implements AutomationSimulationManager {
  public async simulateAddAutomation(params: {
    position: Position
    triggers: AddAutomationParameters
  }): Promise<AddAutomationSimulation> {
    // TODO: Implement
    return {} as AddAutomationSimulation
  }

  public async simulateRemoveAutomation(params: {
    id: AutomationId
  }): Promise<RemoveAutomationSimulation> {
    // TODO: Implement
    return {} as RemoveAutomationSimulation
  }
}
