import { ProtocolsManager } from '~sdk/protocols'
import { TokensManager } from '~sdk/tokens'
import { Chain, ChainInfo } from '~sdk/chains'

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
