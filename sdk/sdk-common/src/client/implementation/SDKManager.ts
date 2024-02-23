import { PortfolioManager, UsersManager } from '~sdk-common/client'
import { ChainsManager, ISDKManager } from '~sdk-common/client'
import { SimulationsManager, SimulationManagerClientImpl } from '~sdk-common/simulations'

export class SDKManager implements ISDKManager {
  public readonly simulator: SimulationsManager
  public readonly chains: ChainsManager
  public readonly users: UsersManager
  public readonly portfolio: PortfolioManager

  public constructor() {
    this.simulator = new SimulationManagerClientImpl()
    this.chains = new ChainsManager()
    this.users = new UsersManager()
    this.portfolio = new PortfolioManager()
  }
}
