import { RefinanceSimulationManager } from '~sdk/managers'
import { RefinanceParameters, RefinanceSimulation } from '~sdk/orders'
import { Pool } from '~sdk/protocols'
import { Position } from '~sdk/user'

/**
 * @class FinanceSimulationManagerClientImpl
 * @description Client implementation of the AutomationSimulationManager interface
 * @see RefinanceSimulationManager
 */
export abstract class RefinanceSimulationManagerClientImpl implements RefinanceSimulationManager {
  /// Instance Methods

  /**
   * @method simulateRefinance
   * @see RefinanceSimulationManager#simulateRefinance
   */
  public async simulateRefinance(params: {
    position: Position
    pool: Pool
    parameters: RefinanceParameters
  }): Promise<RefinanceSimulation> {
    // TODO: Implement
    return {} as RefinanceSimulation
  }
}
