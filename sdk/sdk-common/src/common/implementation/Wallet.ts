import { SerializationService } from '../../services/SerializationService'
import { IAddress } from '../interfaces/IAddress'
import { IWallet, IWalletParameters, __signature__ } from '../interfaces/IWallet'

/**
 * @interface Wallet
 * @see IWalletData
 */
export class Wallet implements IWallet {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly address: IAddress

  /** FACTORY */
  static createFrom(params: IWalletParameters): Wallet {
    return new Wallet(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IWalletParameters) {
    this.address = params.address
  }

  /** METHODS */

  /** @see IWallet.equals */
  equals(wallet: Wallet): boolean {
    return this.address.equals(wallet.address)
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `Wallet: ${this.address.toString()}`
  }
}

SerializationService.registerClass(Wallet)
