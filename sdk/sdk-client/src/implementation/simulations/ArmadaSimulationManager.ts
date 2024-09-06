import { IRPCClient } from '../../interfaces/IRPCClient'

import { RPCMainClientType } from '../../rpc/SDKMainClient'
import { ArmadaUsersSimulationManager } from './ArmadaUsersSimulationManager'

/** @see IArmadaSimulationManager */
export class ArmadaSimulationManager extends IRPCClient {
  readonly users: ArmadaUsersSimulationManager
  readonly keepers: ArmadaUsersSimulationManager

  /** CONSTRUCTOR */
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)

    this.users = new ArmadaUsersSimulationManager(params)
    this.keepers = new ArmadaUsersSimulationManager(params)
  }
}
