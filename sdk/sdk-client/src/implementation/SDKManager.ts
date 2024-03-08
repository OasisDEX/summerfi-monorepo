import { ChainsManager } from '~sdk-client/implementation/ChainsManager'
import { SimulationManager } from './simulations/SimulationManager'
import { UsersManager } from '~sdk-client/implementation/UsersManager'
import { PortfolioManager } from '~sdk-client/implementation/PortfolioManager'

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
