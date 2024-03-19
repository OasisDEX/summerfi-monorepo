import { RPCClientType } from '../rpc/SDKClient'

export abstract class IRPCClient {
  private readonly _rpcClient: RPCClientType

  constructor(params: { rpcClient: RPCClientType }) {
    this._rpcClient = params.rpcClient
  }

  protected get rpcClient(): RPCClientType {
    return this._rpcClient
  }
}
