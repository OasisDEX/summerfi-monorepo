import { ChainsManager, ChainsManagerClientImpl } from '~sdk-common/chains'
import { SimulationsManager, SimulationManagerClientImpl } from '~sdk-common/simulations'
import { PortfolioManager, PortfolioManagerClientImpl } from '~sdk-common/portfolio'
import { UsersManager, UsersManagerClientImpl } from '~sdk-common/users'
import { SDKManager } from '~sdk-common/entrypoint'

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
