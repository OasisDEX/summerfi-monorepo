import { IArmadaManagerClient } from '../../interfaces/ArmadaManager/IArmadaManagerClient'
import { IArmadaManagerAdminClient } from '../../interfaces/ArmadaManager/IArmadaManagerAdminClient'
import { IArmadaManagerUsersClient } from '../../interfaces/ArmadaManager/IArmadaManagerUsersClient'
import { IArmadaManagerClientAccessControl } from '../../interfaces/ArmadaManager/IArmadaManagerClientAccessControl'
import { RPCMainClientType } from '../../rpc/SDKMainClient'
import { ArmadaManagerAdminClient } from './ArmadaManagerAdminClient'
import { ArmadaManagerUsersClient } from './ArmadaManagerUsersClient'
import { ArmadaManagerClientAccessControl } from './ArmadaManagerClientAccessControl'

/**
 * @name ArmadaManagerClient
 * @description Implementation of the Armada Manager client interface of the Armada
 */
export class ArmadaManagerClient implements IArmadaManagerClient {
  /** APIs for the Armada protocol */
  readonly users: IArmadaManagerUsersClient
  readonly admin: IArmadaManagerAdminClient
  readonly accessControl: IArmadaManagerClientAccessControl

  constructor(params: { rpcClient: RPCMainClientType }) {
    this.users = new ArmadaManagerUsersClient(params)
    this.admin = new ArmadaManagerAdminClient(params)
    this.accessControl = new ArmadaManagerClientAccessControl(params)
  }
}
