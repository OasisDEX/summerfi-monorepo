import type { IChain } from '~sdk-client/interfaces/IChain'
import type { TokensManager } from '~sdk-client/implementation/TokensManager'
import type { ProtocolsManager } from '~sdk-client/implementation/ProtocolsManager'
import type { ChainInfo } from '@summerfi/sdk-common/common'

export class Chain implements IChain {
  readonly chainInfo: ChainInfo
  readonly tokens: TokensManager
  readonly protocols: ProtocolsManager

  constructor(params: {
    chainInfo: ChainInfo
    tokensManager: TokensManager
    protocolsManager: ProtocolsManager
  }) {
    this.chainInfo = params.chainInfo
    this.tokens = params.tokensManager
    this.protocols = params.protocolsManager
  }

  getLatestBlock() {
    // TODO: Implement
  }

  getBlock() {
    // TODO: Implement
  }

  toString(): string {
    return `${this.chainInfo.name} (ID: ${this.chainInfo.chainId})`
  }
}
