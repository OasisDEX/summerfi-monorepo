import { Wallet } from '~sdk/common'
import { AddressBaseImpl } from './AddressBaseImpl'

/**
 * @class Wallet
 * @see Wallet
 */
export class WalletBaseImpl implements Wallet {
  /// Instance Attributes
  public readonly address: AddressBaseImpl

  /// Constructor
  private constructor(params: { address: string }) {
    this.address = AddressBaseImpl.fromAddress(params.address)
  }

  /// Static Methods
  public static create(params: { address: string }): Wallet {
    return new WalletBaseImpl(params)
  }

  /// Instance Methods

  /**
   * @see Printable.toString
   */
  public toString(): string {
    return `Wallet: ${this.address.toString()}`
  }
}
