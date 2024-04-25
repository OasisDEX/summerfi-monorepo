import { SerializationService } from '../../services/SerializationService'
import { IWalletData } from '../interfaces/IWallet'
import { Address } from './Address'

/**
 * @interface Wallet
 * @see IWalletData
 */
export class Wallet implements IWalletData {
  readonly address: Address

  private constructor(params: IWalletData) {
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
