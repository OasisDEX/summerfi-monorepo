import { Maybe } from '~sdk-common/utils'
import { Protocol, ProtocolName, ProtocolsRegistry } from '~sdk-common/protocols'
import type { IProtocolsManager } from '~sdk-common/client/interfaces'
import type { ChainInfo } from '~sdk-common/common/implementation'

export class ProtocolsManager implements IProtocolsManager {
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
