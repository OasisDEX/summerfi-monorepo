import { type ChainInfo } from '@summerfi/sdk-common/common'
import type { ProtocolsManager } from '~sdk-client/implementation/ProtocolsManager'
import type { TokensManager } from '~sdk-client/implementation/TokensManager'
/**
 * @interface IChain
 * @description Represents a blockchain network and allows to access the tokens and protocols of the chain
 */
export interface IChain {
  chainInfo: ChainInfo
  tokens: TokensManager
  protocols: ProtocolsManager
}
