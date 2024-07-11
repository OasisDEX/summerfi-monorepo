import { SerializationService } from '../../services/SerializationService'
import { IWallet, IWalletData } from '../interfaces/IWallet'
import { Address } from './Address'

/**
 * @interface Wallet
 * @see IWalletData
 */
export class Wallet implements IWallet {
  readonly address: Address

  /** Factory method */
  static createFrom(params: IWalletData): Wallet {
    return new Wallet(params)
  }

  /** Sealed constructor */
  private constructor(params: IWalletData) {
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
