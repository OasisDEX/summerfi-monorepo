import { FinanceSimulationManager } from '~sdk/managers'
import {
  AddCollateralParameters,
  AddCollateralSimulation,
  ClosePositionParameters,
  ClosePositionSimulation,
  CreatePositionParameters,
  CreatePositionSimulation,
} from '~sdk/orders'
import { Pool } from '~sdk/protocols'
import { Position } from '~sdk/user'

export class FinanceSimulationManagerClientImpl implements FinanceSimulationManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async simulateCreatePosition(params: {
    pool: Pool
    parameters: CreatePositionParameters
  }): Promise<CreatePositionSimulation> {
    // TODO: Implement
    return {} as CreatePositionSimulation
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async simulateAddCollateralToPosition(params: {
    position: Position
    parameters: AddCollateralParameters
  }): Promise<AddCollateralSimulation> {
    // TODO: Implement
    return {} as AddCollateralSimulation
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async simulateClosePosition(params: {
    position: Position
    parameters: ClosePositionParameters
  }): Promise<ClosePositionSimulation> {
    // TODO: Implement
    return {} as ClosePositionSimulation
  }
}
