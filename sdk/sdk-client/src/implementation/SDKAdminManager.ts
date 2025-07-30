import { RPCMainClientType } from '../rpc/SDKMainClient'
import { ArmadaManagerClient } from './ArmadaManager/ArmadaManagerClient'
import { ChainsManagerClient } from './ChainsManager'
import { SwapManagerClient } from './SwapManagerClient'
import { OracleManagerClient } from './OracleManagerClient'
import { UsersManager } from './UsersManager'
import type { ISDKAdminManager } from '../interfaces/ISDKAdminManager'

/** @see ISDKAdminManager */
export class SDKAdminManager implements ISDKAdminManager {
  public readonly chains: ChainsManagerClient
  public readonly users: UsersManager
  public readonly armada: ArmadaManagerClient
  public readonly swaps: SwapManagerClient
  public readonly oracle: OracleManagerClient

  public constructor(params: { rpcClient: RPCMainClientType }) {
    this.chains = new ChainsManagerClient(params)
    this.users = new UsersManager(params)
    this.armada = new ArmadaManagerClient(params)
    this.swaps = new SwapManagerClient(params)
    this.oracle = new OracleManagerClient(params)
  }
}
