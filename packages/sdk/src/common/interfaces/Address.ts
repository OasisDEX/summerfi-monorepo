import { Printable } from './Printable'

/**
 * @enum AddressType
 * @description Represents the type of a blockchain address
 */
export enum AddressType {
  Unknown = 'Unknown',
  Ethereum = 'Ethereum',
}

/**
 * @interface Address
 * @description Represents a blockchain address
 */
export interface Address extends Printable {
  address: string
  type: AddressType
}
