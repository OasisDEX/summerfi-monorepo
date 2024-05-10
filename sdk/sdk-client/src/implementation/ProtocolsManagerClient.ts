import type { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { IProtocolsManagerClient } from '../interfaces/IProtocolsManagerClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCClientType } from '../rpc/SDKClient'
import { ProtocolClient } from './ProtocolClient'

export class ProtocolsManagerClient extends IRPCClient implements IProtocolsManagerClient {
  private readonly _chainInfo: ChainInfo

  public constructor(params: { rpcClient: RPCClientType; chainInfo: ChainInfo }) {
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
