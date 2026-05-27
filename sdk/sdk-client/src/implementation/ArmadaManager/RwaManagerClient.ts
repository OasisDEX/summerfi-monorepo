import { IRwaManagerClient } from '../../interfaces/ArmadaManager/IRwaManagerClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * @name RwaManagerClient
 * @description Implementation of the RWA manager client interface
 */
export class RwaManagerClient extends IRPCClient implements IRwaManagerClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  async getVaultInfoListPerChain(
    params: Parameters<IRwaManagerClient['getVaultInfoListPerChain']>[0],
  ): ReturnType<IRwaManagerClient['getVaultInfoListPerChain']> {
    return this.rpcClient.armada.rwa.getVaultInfoListPerChain.query(params)
  }

  async getVaultsRaw(
    params: Parameters<IRwaManagerClient['getVaultsRaw']>[0],
  ): ReturnType<IRwaManagerClient['getVaultsRaw']> {
    return this.rpcClient.armada.rwa.getVaultsRaw.query(params)
  }
}
