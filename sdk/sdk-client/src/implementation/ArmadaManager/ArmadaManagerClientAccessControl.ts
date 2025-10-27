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

  /** @see IArmadaManagerClientAccessControl.hasGlobalRole */
  async hasGlobalRole(
    params: Parameters<IArmadaManagerClientAccessControl['hasGlobalRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['hasGlobalRole']> {
    return this.rpcClient.armada.accessControl.hasGlobalRole.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.hasContractSpecificRole */
  async hasContractSpecificRole(
    params: Parameters<IArmadaManagerClientAccessControl['hasContractSpecificRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['hasContractSpecificRole']> {
    return this.rpcClient.armada.accessControl.hasContractSpecificRole.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.grantGlobalRole */
  async grantGlobalRole(
    params: Parameters<IArmadaManagerClientAccessControl['grantGlobalRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['grantGlobalRole']> {
    return this.rpcClient.armada.accessControl.grantGlobalRole.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.revokeGlobalRole */
  async revokeGlobalRole(
    params: Parameters<IArmadaManagerClientAccessControl['revokeGlobalRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['revokeGlobalRole']> {
    return this.rpcClient.armada.accessControl.revokeGlobalRole.query(params)
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

  /** @see IArmadaManagerClientAccessControl.getAllAddressesWithGlobalRole */
  async getAllAddressesWithGlobalRole(
    params: Parameters<IArmadaManagerClientAccessControl['getAllAddressesWithGlobalRole']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['getAllAddressesWithGlobalRole']> {
    return this.rpcClient.armada.accessControl.getAllAddressesWithGlobalRole.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.getAllAddressesWithContractSpecificRole */
  async getAllAddressesWithContractSpecificRole(
    params: Parameters<
      IArmadaManagerClientAccessControl['getAllAddressesWithContractSpecificRole']
    >[0],
  ): ReturnType<IArmadaManagerClientAccessControl['getAllAddressesWithContractSpecificRole']> {
    return this.rpcClient.armada.accessControl.getAllAddressesWithContractSpecificRole.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.isWhitelisted */
  async isWhitelisted(
    params: Parameters<IArmadaManagerClientAccessControl['isWhitelisted']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['isWhitelisted']> {
    return this.rpcClient.armada.accessControl.isWhitelisted.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.setWhitelisted */
  async setWhitelisted(
    params: Parameters<IArmadaManagerClientAccessControl['setWhitelisted']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['setWhitelisted']> {
    return this.rpcClient.armada.accessControl.setWhitelisted.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.setWhitelistedBatch */
  async setWhitelistedBatch(
    params: Parameters<IArmadaManagerClientAccessControl['setWhitelistedBatch']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['setWhitelistedBatch']> {
    return this.rpcClient.armada.accessControl.setWhitelistedBatch.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.isWhitelistedAQ */
  async isWhitelistedAQ(
    params: Parameters<IArmadaManagerClientAccessControl['isWhitelistedAQ']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['isWhitelistedAQ']> {
    return this.rpcClient.armada.accessControl.isWhitelistedAQ.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.setWhitelistedAQ */
  async setWhitelistedAQ(
    params: Parameters<IArmadaManagerClientAccessControl['setWhitelistedAQ']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['setWhitelistedAQ']> {
    return this.rpcClient.armada.accessControl.setWhitelistedAQ.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.setWhitelistedBatchAQ */
  async setWhitelistedBatchAQ(
    params: Parameters<IArmadaManagerClientAccessControl['setWhitelistedBatchAQ']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['setWhitelistedBatchAQ']> {
    return this.rpcClient.armada.accessControl.setWhitelistedBatchAQ.query(params)
  }

  /** @see IArmadaManagerClientAccessControl.getAllRoles */
  async getAllRoles(
    params: Parameters<IArmadaManagerClientAccessControl['getAllRoles']>[0],
  ): ReturnType<IArmadaManagerClientAccessControl['getAllRoles']> {
    return this.rpcClient.armada.accessControl.getAllRoles.query(params)
  }
}
