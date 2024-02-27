import { TokensManager, ProtocolsManager } from '~sdk-common/client'
import type { IChainInfoSerialized } from '~sdk-common/common/implementation/ChainInfo'

/**
 * @interface IChain
 * @description Represents a blockchain network and allows to access the tokens and protocols of the chain
 */
export interface IChain {
  chainInfo: IChainInfoSerialized
  tokens: TokensManager
  protocols: ProtocolsManager
}
