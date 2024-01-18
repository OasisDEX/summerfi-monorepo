import { Address } from './Address'
import { NetworkId } from '../../network/interfaces/Network'
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
  networkId: NetworkId
  address: Address
  symbol: string
  name: string
  decimals: number
}
