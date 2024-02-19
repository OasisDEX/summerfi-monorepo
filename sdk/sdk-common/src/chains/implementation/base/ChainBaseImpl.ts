import { ProtocolsManager } from '~sdk-common/protocols'
import { TokensManager } from '~sdk-common/tokens'
import { Chain, ChainInfo } from '~sdk-common/chains'

export abstract class ChainBaseImpl implements Chain {
  public readonly chainInfo: ChainInfo
  public readonly tokens: TokensManager
  public readonly protocols: ProtocolsManager

  constructor(params: {
    chainInfo: ChainInfo
    tokensManager: TokensManager
    protocolsManager: ProtocolsManager
  }) {
    this.chainInfo = params.chainInfo
    this.tokens = params.tokensManager
    this.protocols = params.protocolsManager
  }

  public getLatestBlock() {
    // TODO: Implement
  }

  public getBlock() {
    // TODO: Implement
  }

  public toString(): string {
    return `${this.chainInfo.name} (ID: ${this.chainInfo.chainId})`
  }
}
