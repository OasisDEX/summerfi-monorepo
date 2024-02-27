import { AutomationSimulationManager } from '~sdk-common/simulations'
import {
  AddAutomationParameters,
  AddAutomationSimulation,
  AutomationId,
  RemoveAutomationSimulation,
} from '~sdk-common/orders'
import type { Position } from '~sdk-common/common/implementation'

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
