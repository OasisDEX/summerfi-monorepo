import { SerializationService } from '../../services/SerializationService'
import { AddressValue } from '../aliases/AddressValue'
import { Address } from './Address'

interface IWalletSerialized {
  address: Address
}

/**
 * @interface Wallet
 * @description Represents a wallet on a blockchain
 */
export class Wallet implements IWalletSerialized {
  readonly address: Address

  private constructor(params: IWalletSerialized) {
    this.address = params.address
  }

  static createFrom({ value }: { value: AddressValue }): Wallet {
    return new Wallet({ address: Address.createFrom({ value }) })
  }

  toString(): string {
    return `Wallet: ${this.address.toString()}`
  }
}

SerializationService.registerClass(Wallet)
