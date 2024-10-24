import { SerializationService } from '../../services/SerializationService'
import { IAddress } from '../interfaces/IAddress'
import { IWallet, IWalletData, __signature__ } from '../interfaces/IWallet'

/**
 * Type for the parameters of Wallet
 */
export type WalletParameters = Omit<IWalletData, ''>

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
  static createFrom(params: WalletParameters): Wallet {
    return new Wallet(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: WalletParameters) {
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

SerializationService.registerClass(Wallet, { identifier: 'Wallet' })
