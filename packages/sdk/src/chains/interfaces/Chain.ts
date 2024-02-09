import { Printable } from '~sdk/common'
import { TokensManager } from '~sdk/tokens'
import { ProtocolsManager } from '~sdk/protocols'

/**
 * @name ChainId
 * @description Represents the unique identifier of a blockchain network
 */
export type ChainId = number

/**
 * @name ChainInfo
 * @description Provides information of a blockchain network
 */
export type ChainInfo = {
  /** The chain ID of the network */
  chainId: ChainId
  /** The name of the network */
  name: string
}

/**
 * @interface Chain
 * @description Represents a blockchain network and allows to access the tokens and protocols of the chain
 */
export interface Chain extends Printable {
  chainInfo: ChainInfo
  tokens: TokensManager
  protocols: ProtocolsManager
}
