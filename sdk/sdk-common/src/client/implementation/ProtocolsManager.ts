import { Maybe } from '../../common/aliases/Maybe'
import { ChainInfo } from '../../common/implementation/ChainInfo'
import { ProtocolsRegistry } from '../../protocols/adapters/ProtocolsRegistry'
import { Protocol } from '../../protocols/interfaces/Protocol'
import { ProtocolName } from '../../protocols/interfaces/ProtocolName'
import { IProtocolsManager } from '../interfaces/IProtocolsManager'

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
