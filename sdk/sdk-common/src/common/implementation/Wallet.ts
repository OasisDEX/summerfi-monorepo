import { Address } from '~sdk-common/common/implementation/Address'
import { SerializationService } from '~sdk-common/services/SerializationService'

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

  static createFrom({ hexValue }: { hexValue: string }): Wallet {
    return new Wallet({ address: Address.createFrom({ hexValue }) })
  }

  toString(): string {
    return `Wallet: ${this.address.toString()}`
  }
}

SerializationService.registerClass(Wallet)
