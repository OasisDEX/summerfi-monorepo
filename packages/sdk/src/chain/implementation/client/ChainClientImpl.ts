import { ProtocolsManagerClientImpl, TokensManagerClientImpl } from '~sdk/managers'
import { Chain, ChainInfo } from '~sdk/chain'
import { ChainBaseImpl } from '../base/ChainBaseImpl'

export class ChainClientImpl extends ChainBaseImpl implements Chain {
  constructor(chainInfo: ChainInfo) {
    super(chainInfo, new TokensManagerClientImpl(), new ProtocolsManagerClientImpl())
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
