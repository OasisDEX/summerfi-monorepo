import { ChainsManager } from '~sdk-common/client/implementation/ChainsManager'
import { PortfolioManager } from '~sdk-common/client/implementation/PortfolioManager'
import { UsersManager } from '~sdk-common/client/implementation/UsersManager'
import { SimulationManager } from './simulations/SimulationManager'

export class SDKManager {
  public readonly simulator: SimulationManager
  public readonly chains: ChainsManager
  public readonly users: UsersManager
  public readonly portfolio: PortfolioManager

  public constructor() {
    this.simulator = new SimulationManager()
    this.chains = new ChainsManager()
    this.users = new UsersManager()
    this.portfolio = new PortfolioManager()
  }
}
