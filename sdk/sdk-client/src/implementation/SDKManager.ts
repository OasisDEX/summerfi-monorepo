import { ISDKManager } from '../interfaces/ISDKManager'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { ArmadaManagerClient } from './ArmadaManager/ArmadaManagerClient'
import { DcaManagerClient } from './ArmadaManager/DcaManagerClient'
import { RwaManagerClient } from './ArmadaManager/RwaManagerClient'
import { ChainsManagerClient } from './ChainsManager'
import { PortfolioManager } from './PortfolioManager'
import { SwapManagerClient } from './SwapManagerClient'
import { OracleManagerClient } from './OracleManagerClient'
import { UsersManager } from './UsersManager'
import { SimulationManager } from './simulations/SimulationManager'
import { TokensManagerClient2 } from './TokensManagerClient2'
import { IntentSwapClient } from './IntentSwapClient'
import { AllowanceManagerClient } from './AllowanceManagerClient'

/** @see ISDKManager */
export class SDKManager implements ISDKManager {
  public readonly simulator: SimulationManager
  public readonly chains: ChainsManagerClient
  public readonly tokens: TokensManagerClient2
  public readonly users: UsersManager
  public readonly portfolio: PortfolioManager
  public readonly dca: DcaManagerClient
  public readonly rwa: RwaManagerClient
  public readonly armada: ArmadaManagerClient
  public readonly swaps: SwapManagerClient
  public readonly oracle: OracleManagerClient
  public readonly intentSwaps: IntentSwapClient
  public readonly allowance: AllowanceManagerClient

  public constructor(params: { rpcClient: RPCMainClientType }) {
    this.simulator = new SimulationManager(params)
    this.chains = new ChainsManagerClient(params)
    this.tokens = new TokensManagerClient2(params)
    this.users = new UsersManager(params)
    this.portfolio = new PortfolioManager(params)
    this.dca = new DcaManagerClient(params)
    this.rwa = new RwaManagerClient(params)
    this.armada = new ArmadaManagerClient(params)
    this.swaps = new SwapManagerClient(params)
    this.oracle = new OracleManagerClient(params)
    this.intentSwaps = new IntentSwapClient(params)
    this.allowance = new AllowanceManagerClient(params)
  }
}
