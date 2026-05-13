import { IArmadaManagerDCAClient } from '../../interfaces/ArmadaManager/IArmadaManagerDCAClient'
import { IRPCClient } from '../../interfaces/IRPCClient'
import { RPCMainClientType } from '../../rpc/SDKMainClient'

/**
 * @name ArmadaManagerDCAClient
 * @description Implementation of the Armada Manager DCA client interface
 */
export class ArmadaManagerDCAClient extends IRPCClient implements IArmadaManagerDCAClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  async createAndSaveBuyOrder(
    params: Parameters<IArmadaManagerDCAClient['createAndSaveBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCAClient['createAndSaveBuyOrder']> {
    return this.rpcClient.armada.dca.createAndSaveBuyOrder.query(params)
  }

  async getBuyOrder(
    params: Parameters<IArmadaManagerDCAClient['getBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCAClient['getBuyOrder']> {
    return this.rpcClient.armada.dca.getBuyOrder.query(params)
  }

  async getBuyOrders(
    params: Parameters<IArmadaManagerDCAClient['getBuyOrders']>[0],
  ): ReturnType<IArmadaManagerDCAClient['getBuyOrders']> {
    return this.rpcClient.armada.dca.getBuyOrders.query(params)
  }

  async cancelBuyOrder(
    params: Parameters<IArmadaManagerDCAClient['cancelBuyOrder']>[0],
  ): ReturnType<IArmadaManagerDCAClient['cancelBuyOrder']> {
    return this.rpcClient.armada.dca.cancelBuyOrder.query(params)
  }
}
