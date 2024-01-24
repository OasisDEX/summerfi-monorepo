import { AutomationSimulationManager } from '~sdk/simulations'
import {
  AddAutomationParameters,
  AddAutomationSimulation,
  AutomationId,
  RemoveAutomationSimulation,
} from '~sdk/orders'
import { Position } from '~sdk/users'

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
