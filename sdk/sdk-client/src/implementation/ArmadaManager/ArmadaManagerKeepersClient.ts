import { TransactionInfo } from '@summerfi/sdk-common'
import { IArmadaManagerKeepersClient } from '../../interfaces/ArmadaManager/IArmadaManagerKeepersClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * @name ArmadaManagerKeepersClient
 * @description Implementation of the Armada Manager Keepers client interface for Users of the Armada
 */
export class ArmadaManagerKeepersClient extends IRPCClient implements IArmadaManagerKeepersClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see IArmadaManagerKeepersClient.rebalance */
  async rebalance(
    params: Parameters<IArmadaManagerKeepersClient['rebalance']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.keepers.rebalance.query(params)
  }

  /** @see IArmadaManagerKeepersClient.adjustBuffer */
  async adjustBuffer(
    params: Parameters<IArmadaManagerKeepersClient['adjustBuffer']>[0],
  ): Promise<TransactionInfo> {
    return this.rpcClient.armada.keepers.adjustBuffer.query(params)
  }
}
