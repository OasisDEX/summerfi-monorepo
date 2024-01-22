import { Wallet } from '~sdk/common'
import { AddressBaseImpl } from './AddressBaseImpl'

export class WalletBaseImpl implements Wallet {
  public readonly address: AddressBaseImpl

  constructor(params: { address: string }) {
    this.address = AddressBaseImpl.fromAddress(params.address)
  }

  public static create(params: { address: string }): Wallet {
    return new WalletBaseImpl(params)
  }

  public toString(): string {
    return `Wallet: ${this.address.toString()}`
  }
}
