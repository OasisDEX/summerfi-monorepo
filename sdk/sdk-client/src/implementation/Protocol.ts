import { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { IPool, IPoolId, ProtocolName } from '@summerfi/sdk-common/protocols'
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

  getPool(params: { poolId: IPoolId }): Promise<Maybe<IPool>> {
    return this.rpcClient.getPool.query({
      poolId: params.poolId,
    })
  }
}
