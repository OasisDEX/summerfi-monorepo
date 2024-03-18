import { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import {
  IPool,
  PoolParameters,
  ProtocolName,
  ProtocolParameters,
} from '@summerfi/sdk-common/protocols'
import { IProtocolClient } from '../interfaces/IProtocolClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCClientType } from '../rpc/SDKClient'

export class Protocol extends IRPCClient implements IProtocolClient {
  public readonly name: ProtocolName
  public readonly chainInfo: ChainInfo

  constructor(params: { rpcClient: RPCClientType; name: ProtocolName; chainInfo: ChainInfo }) {
    super(params)

    this.name = params.name
    this.chainInfo = params.chainInfo
  }

  getPool(params: {
    poolParameters: PoolParameters
    protocolParameters?: ProtocolParameters
  }): Promise<Maybe<IPool>> {
    return this.rpcClient.getPool.query({
      ...params,
      protocol: this,
    })
  }
}
