import { SerializationService } from '../../services/SerializationService'
import { IWallet, IWalletParameters } from '../interfaces/IWallet'
import { Address } from './Address'

/**
 * @interface Wallet
 * @see IWalletData
 */
export class Wallet implements IWallet {
  readonly _signature_0 = 'IWallet'

  readonly address: Address

  /** Factory method */
  static createFrom(params: IWalletParameters): Wallet {
    return new Wallet(params)
  }

  /** Sealed constructor */
  private constructor(params: IWalletParameters) {
    this.address = Address.createFrom(params.address)
  }

  equals(wallet: Wallet): boolean {
    return this.address.equals(wallet.address)
  }

  toString(): string {
    return `Wallet: ${this.address.toString()}`
  }
}

SerializationService.registerClass(Wallet)
