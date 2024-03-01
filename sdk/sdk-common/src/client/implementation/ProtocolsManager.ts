import type { Maybe } from '~sdk-common/common/aliases'
import type { IProtocolsManager } from '~sdk-common/client/interfaces/IProtocolsManager'
import type { ChainInfo } from '~sdk-common/common/implementation/ChainInfo'
import { ProtocolsRegistry } from '~sdk-common/protocols/adapters'
import type { Protocol } from '~sdk-common/protocols/interfaces/Protocol'
import type { ProtocolName } from '~sdk-common/protocols/interfaces/ProtocolName'

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
