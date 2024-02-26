import { Address } from '~sdk-common/common/implementation'
import { SerializationManager } from '~sdk-common/common/managers'

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

SerializationManager.registerClass(Wallet)
