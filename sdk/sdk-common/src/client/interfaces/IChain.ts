import type { ProtocolsManager } from '~sdk-common/client/implementation/ProtocolsManager'
import type { TokensManager } from '~sdk-common/client/implementation/TokensManager'
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
