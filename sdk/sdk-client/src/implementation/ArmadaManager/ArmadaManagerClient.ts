import { IArmadaManagerClient } from '../../interfaces/ArmadaManager/IArmadaManagerClient'
import { IArmadaManagerAdminClient } from '../../interfaces/ArmadaManager/IArmadaManagerAdminClient'
import { IArmadaManagerUsersClient } from '../../interfaces/ArmadaManager/IArmadaManagerUsersClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'
import { ArmadaManagerAdminClient } from './ArmadaManagerAdminClient'
import { ArmadaManagerUsersClient } from './ArmadaManagerUsersClient'

/**
 * @name ArmadaManagerClient
 * @description Implementation of the Armada Manager client interface of the Armada
 */
export class ArmadaManagerClient implements IArmadaManagerClient {
  /** APIs for the Armada protocol */
  readonly users: IArmadaManagerUsersClient
  readonly admin: IArmadaManagerAdminClient

  constructor(params: { rpcClient: RPCMainClientType }) {
    this.users = new ArmadaManagerUsersClient(params)
    this.admin = new ArmadaManagerAdminClient(params)
  }
}
