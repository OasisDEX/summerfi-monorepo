import { ProtocolsManagerClientImpl } from '~sdk-common/protocols'
import { TokensManagerClientImpl } from '~sdk-common/tokens'
import { Chain, ChainInfo } from '~sdk-common/chains'
import { ChainBaseImpl } from '../base/ChainBaseImpl'

export class ChainClientImpl extends ChainBaseImpl implements Chain {
  constructor(params: { chainInfo: ChainInfo }) {
    super({
      chainInfo: params.chainInfo,
      tokensManager: new TokensManagerClientImpl({ chainInfo: params.chainInfo }),
      protocolsManager: new ProtocolsManagerClientImpl({ chainInfo: params.chainInfo }),
    })
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
