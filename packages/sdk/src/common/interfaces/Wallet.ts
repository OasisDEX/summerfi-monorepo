import { Address } from './Address'
import { Printable } from './Printable'

/**
 * @interface Wallet
 * @description Represents a wallet on a blockchain
 */
export interface Wallet extends Printable {
  address: Address
}
