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

/**
 * @class FinanceSimulationManagerClientImpl
 * @description Client implementation of the AutomationSimulationManager interface
 * @see FinanceSimulationManager
 */
export abstract class FinanceSimulationManagerClientImpl implements FinanceSimulationManager {
  /// Instance Methods

  /**
   * @method simulateCreatePosition
   * @see FinanceSimulationManager#simulateCreatePosition
   */
  public async simulateCreatePosition(params: {
    pool: Pool
    parameters: CreatePositionParameters
  }): Promise<CreatePositionSimulation> {
    // TODO: Implement
    return {} as CreatePositionSimulation
  }

  /**
   * @method simulateAddCollateralPosition
   * @see FinanceSimulationManager#simulateAddCollateralPosition
   */
  public async simulateAddCollateralPosition(params: {
    position: Position
    parameters: AddCollateralParameters
  }): Promise<AddCollateralSimulation> {
    // TODO: Implement
    return {} as AddCollateralSimulation
  }

  /**
   * @method simulateClosePosition
   * @see FinanceSimulationManager#simulateClosePosition
   */
  public async simulateClosePosition(params: {
    position: Position
    parameters: ClosePositionParameters
  }): Promise<ClosePositionSimulation> {
    // TODO: Implement
    return {} as ClosePositionSimulation
  }
}
