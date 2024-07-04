import type { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { IProtocolsManagerClient } from '../interfaces/IProtocolsManagerClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { ProtocolClient } from './ProtocolClient'

export class ProtocolsManagerClient extends IRPCClient implements IProtocolsManagerClient {
  private readonly _chainInfo: ChainInfo

  public constructor(params: { rpcClient: RPCMainClientType; chainInfo: ChainInfo }) {
    super(params)

    this._chainInfo = params.chainInfo
  }

  public async getProtocol(params: { name: ProtocolName }): Promise<Maybe<ProtocolClient>> {
    return new ProtocolClient({
      rpcClient: this.rpcClient,
      chainInfo: this._chainInfo,
      ...params,
    })
  }
}
