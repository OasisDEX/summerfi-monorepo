import { Maybe } from '../../common/aliases/Maybe'
import { ChainInfo } from '../../common/implementation/ChainInfo'
import { ProtocolsRegistry } from '../../protocols/adapters/ProtocolsRegistry'
import { Protocol } from '../../protocols/implementation/Protocol'
import { IProtocol } from '../../protocols/interfaces/IProtocol'
import { IProtocolsManager } from '../interfaces/IProtocolsManager'

export class ProtocolsManager implements IProtocolsManager {
  private readonly _chainInfo: ChainInfo

  public constructor(params: { chainInfo: ChainInfo }) {
    this._chainInfo = params.chainInfo
  }

  public getSupportedProtocols(): IProtocol[] {
    return ProtocolsRegistry.getSupportedProtocols({ chainInfo: this._chainInfo })
  }

  public async getProtocol(params: { protocol: IProtocol }): Promise<Maybe<Protocol>> {
    return ProtocolsRegistry.getProtocol({
      protocol: params.protocol,
    })
  }
}
