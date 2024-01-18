import { Wallet } from '~sdk/common'
import { SimulationManager } from '~sdk/managers'
import { NetworkId } from '~sdk/network'
import { Position, PositionId } from '~sdk/user'
import { AutomationSimulationManagerClientImpl } from './simulations/AutomationSimulationManagerClientImpl'
import { FinanceSimulationManagerClientImpl } from './simulations/FinanceSimulationManagerClientImpl'
import { ImportingSimulationManagerClientImpl } from './simulations/ImportingSimulationManagerClientImpl'
import { MigrationSimulationManagerClientImpl } from './simulations/MigrationSimulationManagerClientImpl'
import { RefinanceSimulationManagerClientImpl } from './simulations/RefinanceSimulationManagerClientImpl'

/**
 * @class SimulationManagerClientImpl
 * @see SimulationManager
 */
export class SimulationManagerClientImpl extends AutomationSimulationManagerClientImpl, FinanceSimulationManagerClientImpl, ImportingSimulationManagerClientImpl, MigrationSimulationManagerClientImpl, RefinanceSimulationManagerClientImpl implements SimulationManager {
  /// Class Attributes
  private static _instance: SimulationManagerClientImpl

  /// Constructor
  private constructor() {
    // Empty on purpose
  }

  /// Instance Methods

  /**
   * @method getPositions
   * @see PortfolioManager#getPositions
   */
  public async getPositions(params: {
    networks: NetworkId[]
    wallet: Wallet
    ids?: PositionId[]
  }): Promise<Position[]> {
    // TODO: Implement
    return [] as Position[]
  }

  /// Static Methods

  public static getInstance(): SimulationManagerClientImpl {
    if (!this._instance) {
      this._instance = new SimulationManagerClientImpl()
    }
    return this._instance
  }
}
