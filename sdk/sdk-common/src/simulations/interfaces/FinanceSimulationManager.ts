import type { Position } from '~sdk-common/common/implementation'
import {
  AddCollateralParameters,
  AddCollateralSimulation,
  ClosePositionParameters,
  ClosePositionSimulation,
  CreatePositionParameters,
  CreatePositionSimulation,
} from '~sdk-common/orders'
import { Pool } from '~sdk-common/protocols'

/**
 * @interface FinanceSimulationManager
 * @description Simulations for finance operations
 */
export interface FinanceSimulationManager {
  /**
   * @function simulateCreatePosition
   * @description Simulates the creation of a new position
   *
   * @param pool Pool where the position will be created
   * @param parameters Parameters used to create the new position
   *
   * @returns Simulation data for the creation of a new position
   */
  simulateCreatePosition(params: {
    pool: Pool
    parameters: CreatePositionParameters
  }): Promise<CreatePositionSimulation>

  /**
   * @function simulateAddCollateralToPosition
   * @description Simulates the addition of collateral to a position
   *
   * @param position Position to add collateral to
   * @param parameters Parameters used to add collateral to the position
   *
   * @returns Simulation data for the addition of collateral to a position
   */
  simulateAddCollateralToPosition(params: {
    position: Position
    parameters: AddCollateralParameters
  }): Promise<AddCollateralSimulation>

  /**
   * @function simulateClosePosition
   * @description Simulates the closure of a position
   *
   * @param position Position to close
   * @param parameters Parameters used to close the position
   *
   * @returns Simulation data for the closure of a position
   */
  simulateClosePosition(params: {
    position: Position
    parameters: ClosePositionParameters
  }): Promise<ClosePositionSimulation>
}
