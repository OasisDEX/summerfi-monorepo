import { Wallet } from '~sdk/common'
import { PortfolioManager } from '~sdk/managers'
import { NetworkId } from '~sdk/network'
import { Position, PositionId } from '~sdk/user'

/**
 * @class PortfolioManagerClientImpl
 * @description Client implementation of the PortfolioManager interface
 * @see PortfolioManager
 */
export class PortfolioManagerClientImpl implements PortfolioManager {
  /// Class Attributes
  private static _instance: PortfolioManagerClientImpl

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
  }): Promise<Position[]> {
    // TODO: Implement
    return [] as Position[]
  }

  /// Static Methods

  public static getInstance(): PortfolioManagerClientImpl {
    if (!this._instance) {
      this._instance = new PortfolioManagerClientImpl()
    }
    return this._instance
  }
}
