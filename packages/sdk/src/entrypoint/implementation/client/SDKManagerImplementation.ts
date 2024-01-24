import { ChainsManager, ChainsManagerClientImpl } from '~sdk/chains'
import { SimulationsManager, SimulationManagerClientImpl } from '~sdk/simulations'
import { PortfolioManager, PortfolioManagerClientImpl } from '~sdk/portfolio'
import { UsersManager, UsersManagerClientImpl } from '~sdk/users'
import { SDKManager } from '~sdk/entrypoint'

export class SDKManagerClientImpl implements SDKManager {
  public readonly simulator: SimulationsManager
  public readonly chains: ChainsManager
  public readonly users: UsersManager
  public readonly portfolio: PortfolioManager

  public constructor() {
    this.simulator = new SimulationManagerClientImpl()
    this.chains = new ChainsManagerClientImpl()
    this.users = new UsersManagerClientImpl()
    this.portfolio = new PortfolioManagerClientImpl()
  }
}
