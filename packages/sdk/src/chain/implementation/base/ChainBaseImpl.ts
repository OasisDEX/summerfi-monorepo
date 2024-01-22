import { ProtocolsManager, TokensManager } from '~sdk/managers'
import { Chain, ChainInfo } from '~sdk/chain'

export abstract class ChainBaseImpl implements Chain {
  public readonly chainInfo: ChainInfo
  public readonly tokens: TokensManager
  public readonly protocols: ProtocolsManager

  constructor(chainInfo: ChainInfo, tokens: TokensManager, protocols: ProtocolsManager) {
    this.chainInfo = chainInfo
    this.tokens = tokens
    this.protocols = protocols
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
