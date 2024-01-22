import {
  NetworkManager,
  PortfolioManager,
  SDKManager,
  SimulationManager,
  UserManager,
} from '~sdk/managers'
import { SimulationManagerClientImpl } from './SimulationManagerClientImpl'
import { NetworkManagerClientImpl } from './NetworkManagerClientImpl'
import { PortfolioManagerClientImpl } from './PortfolioManagerClientImpl'
import { UserManagerClientImpl } from './UserManagerClientImpl'

export class SDKManagerClientImpl implements SDKManager {
  public readonly simulator: SimulationManager
  public readonly networks: NetworkManager
  public readonly users: UserManager
  public readonly portfolio: PortfolioManager

  public constructor() {
    this.simulator = new SimulationManagerClientImpl()
    this.networks = new NetworkManagerClientImpl()
    this.users = new UserManagerClientImpl()
    this.portfolio = new PortfolioManagerClientImpl()
  }
}
