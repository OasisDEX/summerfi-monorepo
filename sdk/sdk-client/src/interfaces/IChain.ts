import { IChainInfo } from '@summerfi/sdk-common'
import { IProtocolsManagerClient } from './IProtocolsManagerClient'
import { ITokensManagerClient } from './ITokensManagerClient'

/**
 * @interface IChain
 * @description Represents a blockchain network and allows to access the tokens and protocols of the chain
 */
export interface IChain {
  /** The information of the chain */
  chainInfo: IChainInfo
  /** The tokens manager client for the chain, allows to retrieve tokens on the chain */
  tokens: ITokensManagerClient
  /** The protocols manager client for the chain, allows to retrieve protocols on the chain */
  protocols: IProtocolsManagerClient
}
