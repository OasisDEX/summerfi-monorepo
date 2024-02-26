import { ChainsManager, ChainsManagerClientImpl } from '~sdk-common/chains'
import { PortfolioManager, PortfolioManagerClientImpl } from '~sdk-common/portfolio'
import { UsersManager, UsersManagerClientImpl } from '~sdk-common/users'
import { SDKManager } from '~sdk-common/entrypoint'

export class SDKManagerClientImpl implements SDKManager {
  public readonly simulator: any // SimulatorManager TODO: fix it
  public readonly chains: ChainsManager
  public readonly users: UsersManager
  public readonly portfolio: PortfolioManager

  public constructor() {
    this.simulator = { } // TODO: fix it
    this.chains = new ChainsManagerClientImpl()
    this.users = new UsersManagerClientImpl()
    this.portfolio = new PortfolioManagerClientImpl()
  }
}
