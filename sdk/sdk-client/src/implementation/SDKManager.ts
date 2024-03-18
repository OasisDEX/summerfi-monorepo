import { RPCClientType } from '../rpc/SDKClient'
import { ChainsManager } from './ChainsManager'
import { PortfolioManager } from './PortfolioManager'
import { UsersManager } from './UsersManager'
import { SimulationManager } from './simulations/SimulationManager'

export class SDKManager {
  public readonly simulator: SimulationManager
  public readonly chains: ChainsManager
  public readonly users: UsersManager
  public readonly portfolio: PortfolioManager

  public constructor(params: { rpcClient: RPCClientType }) {
    this.simulator = new SimulationManager(params)
    this.chains = new ChainsManager(params)
    this.users = new UsersManager(params)
    this.portfolio = new PortfolioManager(params)
  }
}
