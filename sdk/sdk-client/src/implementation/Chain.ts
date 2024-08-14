import type { ChainInfo, IChainInfo } from '@summerfi/sdk-common/common'
import { IArmadaManagerClient } from '../interfaces/IArmadaManagerClient'
import { IChain } from '../interfaces/IChain'
import { IProtocolsManagerClient } from '../interfaces/IProtocolsManagerClient'
import { ITokensManagerClient } from '../interfaces/ITokensManagerClient'
import { ProtocolsManagerClient } from './ProtocolsManagerClient'
import { TokensManagerClient } from './TokensManagerClient'

/**
 * @name Chain
 * @description Implementation of the IChain interface for the SDK Client
 */
export class Chain implements IChain {
  readonly chainInfo: IChainInfo
  readonly tokens: ITokensManagerClient
  readonly protocols: IProtocolsManagerClient
  readonly armada: IArmadaManagerClient

  constructor(params: {
    chainInfo: ChainInfo
    tokensManager: TokensManagerClient
    protocolsManager: ProtocolsManagerClient
    armadaManager: IArmadaManagerClient
  }) {
    this.chainInfo = params.chainInfo
    this.tokens = params.tokensManager
    this.protocols = params.protocolsManager
    this.armada = params.armadaManager
  }

  toString(): string {
    return `${this.chainInfo.name} (ID: ${this.chainInfo.chainId})`
  }
}
