import type { ChainInfo } from '@summerfi/sdk-common/common'
import { IChain } from '../interfaces/IChain'
import { TokensManagerClient } from './TokensManagerClient'
import { ProtocolsManagerClient } from './ProtocolsManagerClient'

/**
 * @name Chain
 * @description Implementation of the IChain interface for the SDK Client
 */
export class Chain implements IChain {
  readonly chainInfo: ChainInfo
  readonly tokens: TokensManagerClient
  readonly protocols: ProtocolsManagerClient

  constructor(params: {
    chainInfo: ChainInfo
    tokensManager: TokensManagerClient
    protocolsManager: ProtocolsManagerClient
  }) {
    this.chainInfo = params.chainInfo
    this.tokens = params.tokensManager
    this.protocols = params.protocolsManager
  }

  toString(): string {
    return `${this.chainInfo.name} (ID: ${this.chainInfo.chainId})`
  }
}
