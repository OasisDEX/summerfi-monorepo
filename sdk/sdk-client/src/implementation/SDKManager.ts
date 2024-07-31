import { ISDKManager } from '../interfaces/ISDKManager'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { ChainsManagerClient } from './ChainsManager'
import { PortfolioManager } from './PortfolioManager'
import { UsersManager } from './UsersManager'
import { SimulationManager } from './simulations/SimulationManager'

/** @see ISDKManager */
export class SDKManager implements ISDKManager {
  public readonly simulator: SimulationManager
  public readonly chains: ChainsManagerClient
  public readonly users: UsersManager
  public readonly portfolio: PortfolioManager

  public constructor(params: { rpcClient: RPCMainClientType }) {
    this.simulator = new SimulationManager(params)
    this.chains = new ChainsManagerClient(params)
    this.users = new UsersManager(params)
    this.portfolio = new PortfolioManager(params)
  }
}
