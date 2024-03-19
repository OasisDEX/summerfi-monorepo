import type { ChainInfo } from '@summerfi/sdk-common/common'
import { IChain } from '../interfaces/IChain'
import { TokensManager } from './TokensManager'
import { ProtocolsManager } from './ProtocolsManager'

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
