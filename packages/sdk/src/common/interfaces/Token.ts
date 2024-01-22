import { ChainInfo } from '~sdk/chain'
import { Address } from './Address'
import { Printable } from './Printable'

/**
 * @name Token
 * @description Represents a token on a blockchain and provides information on the following info:
 *              - Network ID
 *              - Address
 *              - Symbol
 *              - Name
 *              - Decimals
 */
export interface Token extends Printable {
  networkId: ChainInfo
  address: Address
  symbol: string
  name: string
  decimals: number
}
