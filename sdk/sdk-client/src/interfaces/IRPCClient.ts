import { RPCMainClientType } from '../rpc/SDKMainClient'

export abstract class IRPCClient {
  private readonly _rpcClient: RPCMainClientType

  constructor(params: { rpcClient: RPCMainClientType }) {
    this._rpcClient = params.rpcClient
  }

  protected get rpcClient(): RPCMainClientType {
    return this._rpcClient
  }
}
