import { Maybe } from '~sdk/utils'
import { Protocol, ProtocolName, ProtocolsRegistry, ProtocolsManager } from '~sdk/protocols'
import { ChainInfo } from '~sdk/chains'

export class ProtocolsManagerClientImpl implements ProtocolsManager {
  private readonly _chainInfo: ChainInfo

  public constructor(params: { chainInfo: ChainInfo }) {
    this._chainInfo = params.chainInfo
  }

  public getSupportedProtocols(): ProtocolName[] {
    return ProtocolsRegistry.getSupportedProtocols({ chainInfo: this._chainInfo })
  }

  public async getProtocolByName<ProtocolType extends Protocol>(params: {
    name: ProtocolName
  }): Promise<Maybe<ProtocolType>> {
    return ProtocolsRegistry.getProtocol<ProtocolType>({
      chainInfo: this._chainInfo,
      name: params.name,
    })
  }
}
