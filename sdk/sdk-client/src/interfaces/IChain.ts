import { type ChainInfo } from '@summerfi/sdk-common/common'
import { TokensManager } from '../implementation/TokensManager'
import { ProtocolsManager } from '../implementation/ProtocolsManager'

/**
 * @interface IChain
 * @description Represents a blockchain network and allows to access the tokens and protocols of the chain
 */
export interface IChain {
  chainInfo: ChainInfo
  tokens: TokensManager
  protocols: ProtocolsManager
}
