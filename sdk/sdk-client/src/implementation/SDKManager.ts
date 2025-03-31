import { ISDKManager } from '../interfaces/ISDKManager'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { ArmadaManagerClient } from './ArmadaManager/ArmadaManagerClient'
import { ChainsManagerClient } from './ChainsManager'
import { PortfolioManager } from './PortfolioManager'
import { SwapManagerClient } from './SwapManagerClient'
import { OracleManagerClient } from './OracleManagerClient'
import { UsersManager } from './UsersManager'
import { SimulationManager } from './simulations/SimulationManager'

/** @see ISDKManager */
export class SDKManager implements ISDKManager {
  public readonly simulator: SimulationManager
  public readonly chains: ChainsManagerClient
  public readonly users: UsersManager
  public readonly portfolio: PortfolioManager
  public readonly armada: ArmadaManagerClient
  public readonly swaps: SwapManagerClient
  public readonly oracle: OracleManagerClient

  public constructor(params: { rpcClient: RPCMainClientType }) {
    this.simulator = new SimulationManager(params)
    this.chains = new ChainsManagerClient(params)
    this.users = new UsersManager(params)
    this.portfolio = new PortfolioManager(params)
    this.armada = new ArmadaManagerClient(params)
    this.swaps = new SwapManagerClient(params)
    this.oracle = new OracleManagerClient(params)
  }
}
