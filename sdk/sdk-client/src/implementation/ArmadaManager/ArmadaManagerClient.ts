import { IArmadaManagerClient } from '../../interfaces/ArmadaManager/IArmadaManagerClient'
import { IArmadaManagerGovernanceClient } from '../../interfaces/ArmadaManager/IArmadaManagerGovernanceClient'
import { IArmadaManagerKeepersClient } from '../../interfaces/ArmadaManager/IArmadaManagerKeepersClient'
import { IArmadaManagerUsersClient } from '../../interfaces/ArmadaManager/IArmadaManagerUsersClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'
import { ArmadaManagerGovernanceClient } from './ArmadaManagerGovernanceClient'
import { ArmadaManagerKeepersClient } from './ArmadaManagerKeepersClient'
import { ArmadaManagerUsersClient } from './ArmadaManagerUsersClient'

/**
 * @name ArmadaManagerClient
 * @description Implementation of the Armada Manager client interface of the Armada
 */
export class ArmadaManagerClient extends IRPCClient implements IArmadaManagerClient {
  /** APIs for the Armada protocol */
  readonly users: IArmadaManagerUsersClient
  readonly keepers: IArmadaManagerKeepersClient
  readonly governance: IArmadaManagerGovernanceClient

  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)

    this.users = new ArmadaManagerUsersClient(params)
    this.keepers = new ArmadaManagerKeepersClient(params)
    this.governance = new ArmadaManagerGovernanceClient(params)
  }
}
