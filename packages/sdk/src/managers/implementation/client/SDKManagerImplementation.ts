import {
  ChainManager,
  PortfolioManager,
  SDKManager,
  SimulationManager,
  UserManager,
} from '~sdk/managers'
import { SimulationManagerClientImpl } from './SimulationManagerClientImpl'
import { ChainsManagerClientImpl } from './ChainsManagerClientImpl'
import { PortfolioManagerClientImpl } from './PortfolioManagerClientImpl'
import { UserManagerClientImpl } from './UserManagerClientImpl'

export class SDKManagerClientImpl implements SDKManager {
  public readonly simulator: SimulationManager
  public readonly chains: ChainManager
  public readonly users: UserManager
  public readonly portfolio: PortfolioManager

  public constructor() {
    this.simulator = new SimulationManagerClientImpl()
    this.chains = new ChainsManagerClientImpl()
    this.users = new UserManagerClientImpl()
    this.portfolio = new PortfolioManagerClientImpl()
  }
}
