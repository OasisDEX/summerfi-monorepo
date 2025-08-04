import { IArmadaManagerClientAccessControl } from '../../interfaces/ArmadaManager/IArmadaManagerClientAccessControl'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * @name ArmadaManagerClientAccessControl
 * @description Implementation of the Armada Manager Access Control client interface for role-based access control operations
 */
export class ArmadaManagerClientAccessControl
  extends IRPCClient
  implements IArmadaManagerClientAccessControl
{
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IArmadaManagerClientAccessControl.hasGeneralRole */
  async hasGeneralRole(
    params: Parameters<IArmadaManagerClientAccessControl['hasGeneralRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['hasGeneralRole']> {
    return this.rpcClient.armada.accessControl.hasGeneralRole.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.hasContractSpecificRole */
  async hasContractSpecificRole(
    params: Parameters<IArmadaManagerClientAccessControl['hasContractSpecificRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['hasContractSpecificRole']> {
    return this.rpcClient.armada.accessControl.hasContractSpecificRole.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.grantGeneralRole */
  async grantGeneralRole(
    params: Parameters<IArmadaManagerClientAccessControl['grantGeneralRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['grantGeneralRole']> {
    return this.rpcClient.armada.accessControl.grantGeneralRole.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.revokeGeneralRole */
  async revokeGeneralRole(
    params: Parameters<IArmadaManagerClientAccessControl['revokeGeneralRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['revokeGeneralRole']> {
    return this.rpcClient.armada.accessControl.revokeGeneralRole.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.grantContractSpecificRole */
  async grantContractSpecificRole(
    params: Parameters<IArmadaManagerClientAccessControl['grantContractSpecificRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['grantContractSpecificRole']> {
    return this.rpcClient.armada.accessControl.grantContractSpecificRole.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.revokeContractSpecificRole */
  async revokeContractSpecificRole(
    params: Parameters<IArmadaManagerClientAccessControl['revokeContractSpecificRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['revokeContractSpecificRole']> {
    return this.rpcClient.armada.accessControl.revokeContractSpecificRole.query(params)
  }
}
