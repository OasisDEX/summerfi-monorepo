import { Wallet } from '~sdk/common'
import { SimulationManager } from '~sdk/managers'
import { NetworkId } from '~sdk/network'
import { Position, PositionId } from '~sdk/user'
import { AutomationSimulationManagerMixin } from './simulations/AutomationSimulationManagerMixin'
import { FinanceSimulationManagerMixin } from './simulations/FinanceSimulationManagerMixin'
import { ImportingSimulationManagerMixin } from './simulations/ImportingSimulationManagerMixin'
import { MigrationSimulationManagerMixin } from './simulations/MigrationSimulationManagerMixin'
import { RefinanceSimulationManagerMixin } from './simulations/RefinanceSimulationManagerMixin'
import { applyMixins } from '~sdk/utils/Mixin'

/**
 * @class SimulationManagerClientImpl
 * @see SimulationManager
 */
export class SimulationManagerClientImpl implements SimulationManager {
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

  public static loadSimulationManagers(): void {
    applyMixins(SimulationManagerClientImpl, [
      AutomationSimulationManagerMixin,
      FinanceSimulationManagerMixin,
      ImportingSimulationManagerMixin,
      MigrationSimulationManagerMixin,
      RefinanceSimulationManagerMixin,
    ])
  }
  public static getInstance(): SimulationManagerClientImpl {
    if (!this._instance) {
      this.loadSimulationManagers()
      this._instance = new SimulationManagerClientImpl()
    }
    return this._instance
  }
}
