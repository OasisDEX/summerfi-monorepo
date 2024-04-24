import { SerializationService } from '../../services/SerializationService'
import { IWallet } from '../interfaces/IWallet'
import { Address } from './Address'

/**
 * @interface Wallet
 * @see IWallet
 */
export class Wallet implements IWallet {
  readonly address: Address

  private constructor(params: IWallet) {
    this.address = Address.createFrom(params.address)
  }

  static createFrom(params: { address: Address }): Wallet {
    return new Wallet({ address: params.address })
  }

  toString(): string {
    return `Wallet: ${this.address.toString()}`
  }
}

SerializationService.registerClass(Wallet)
