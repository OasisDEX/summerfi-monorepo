import { Printable } from './Printable'

/**
 * @enum AddressType
 * @description Represents the type of a blockchain address
 */
export enum AddressType {
  Unknown = 'Unknown',
  Ethereum = 'Ethereum',
}

/**
 * @class Address
 * @description Represents a blockchain address, including its type
 */
export class Address implements Printable {
  public readonly address: string
  public readonly type: AddressType

  private constructor(address: string, type: AddressType) {
    this.address = address
    this.type = type
  }

  public static createFrom(address: string): Address {
    if (this.isValid(address) === false) {
      throw new Error('Address type is unknown')
    }

    const type = this.getType(address)

    return new Address(address, type)
  }

  public static isValid(address: string): boolean {
    const type = this.getType(address)
    return type !== AddressType.Unknown
  }

  public static getType(address: string): AddressType {
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return AddressType.Ethereum
    }
    return AddressType.Unknown
  }

  public toString(): string {
    return `${this.address} (${this.type})`
  }
}
