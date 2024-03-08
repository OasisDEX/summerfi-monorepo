import type { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { ProtocolsRegistry, type Protocol, type IProtocol } from '@summerfi/sdk-common/protocols'
import type { IProtocolsManager } from '~sdk-client/interfaces/IProtocolsManager'

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
