import { Address } from './Address'
import { Printable } from './Printable'

/**
 * @interface Wallet
 * @description Represents a wallet on a blockchain
 */
export class Wallet implements Printable {
  public readonly address: Address

  constructor(params: { hexValue: string }) {
    this.address = Address.createFrom(params)
  }

  public static createFrom(params: { hexValue: string }): Wallet {
    return new Wallet(params)
  }

  public toString(): string {
    return `Wallet: ${this.address.toString()}`
  }
}
