import { AutomationSimulationManager } from '~sdk/managers/interfaces/simulations'
import {
  AddAutomationParameters,
  AddAutomationSimulation,
  AutomationId,
  RemoveAutomationSimulation,
} from '~sdk/orders'
import { Position } from '~sdk/user'

export class AutomationSimulationManagerClientImpl implements AutomationSimulationManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async simulateAddAutomation(params: {
    position: Position
    triggers: AddAutomationParameters
  }): Promise<AddAutomationSimulation> {
    // TODO: Implement
    return {} as AddAutomationSimulation
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async simulateRemoveAutomation(params: {
    id: AutomationId
  }): Promise<RemoveAutomationSimulation> {
    // TODO: Implement
    return {} as RemoveAutomationSimulation
  }
}
