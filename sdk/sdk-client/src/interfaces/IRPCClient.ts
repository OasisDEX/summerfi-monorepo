import { RPCEarnProtocolClientType } from '../rpc/SDKEarnProtocolClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

export abstract class IRPCClient {
  private readonly _rpcClient: RPCMainClientType
  private readonly _earnProtocolRpcClient?: RPCEarnProtocolClientType

  constructor(params: {
    rpcClient: RPCMainClientType
    earnProtocolRpcClient?: RPCEarnProtocolClientType
  }) {
    this._rpcClient = params.rpcClient
    this._earnProtocolRpcClient = params.earnProtocolRpcClient
  }

  protected get rpcClient(): RPCMainClientType {
    return this._rpcClient
  }

  protected get earnProtocolRpcClient(): RPCEarnProtocolClientType {
    if (!this._earnProtocolRpcClient) {
      throw new Error('Earn Protocol RPC client is not available')
    }

    return this._earnProtocolRpcClient
  }
}
