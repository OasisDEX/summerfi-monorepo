import { type ChainInfo } from '@summerfi/sdk-common/common'
import { TokensManagerClient } from '../implementation/TokensManagerClient'
import { ProtocolsManagerClient } from '../implementation/ProtocolsManagerClient'

/**
 * @interface IChain
 * @description Represents a blockchain network and allows to access the tokens and protocols of the chain
 */
export interface IChain {
  /** The information of the chain */
  chainInfo: ChainInfo
  /** The tokens manager client for the chain, allows to retrieve tokens on the chain */
  tokens: TokensManagerClient
  /** The protocols manager client for the chain, allows to retrieve protocols on the chain */
  protocols: ProtocolsManagerClient
}
