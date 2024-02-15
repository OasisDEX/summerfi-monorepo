import { Maybe } from '~sdk-common/utils'
import { Protocol, ProtocolName, ProtocolsRegistry, ProtocolsManager } from '~sdk-common/protocols'
import { ChainInfo } from '~sdk-common/chains'

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
