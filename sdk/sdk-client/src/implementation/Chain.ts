import type { ChainInfo, IChainInfo } from '@summerfi/sdk-common/common'
import { IChain } from '../interfaces/IChain'
import { TokensManagerClient } from './TokensManagerClient'
import { ProtocolsManagerClient } from './ProtocolsManagerClient'
import { IEarnProtocolManagerClient } from '../interfaces/IEarnProtocolManagerClient'
import { IProtocolsManagerClient } from '../interfaces/IProtocolsManagerClient'
import { ITokensManagerClient } from '../interfaces/ITokensManagerClient'

/**
 * @name Chain
 * @description Implementation of the IChain interface for the SDK Client
 */
export class Chain implements IChain {
  readonly chainInfo: IChainInfo
  readonly tokens: ITokensManagerClient
  readonly protocols: IProtocolsManagerClient
  readonly earnProtocol?: IEarnProtocolManagerClient

  constructor(params: {
    chainInfo: ChainInfo
    tokensManager: TokensManagerClient
    protocolsManager: ProtocolsManagerClient
    earnProtocolManager?: IEarnProtocolManagerClient
  }) {
    this.chainInfo = params.chainInfo
    this.tokens = params.tokensManager
    this.protocols = params.protocolsManager
    this.earnProtocol = params.earnProtocolManager
  }

  toString(): string {
    return `${this.chainInfo.name} (ID: ${this.chainInfo.chainId})`
  }
}
