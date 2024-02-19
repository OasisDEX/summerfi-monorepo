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
  public readonly hexValue: string
  public readonly type: AddressType

  private constructor(params: { hexValue: string; type: AddressType }) {
    this.hexValue = params.hexValue
    this.type = params.type
  }

  public static createFrom(params: { hexValue: string }): Address {
    if (this.isValid(params.hexValue) === false) {
      throw new Error('Address type is unknown')
    }

    const type = this.getType(params.hexValue)

    return new Address({ ...params, type: type })
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
    return `${this.hexValue}`
  }
}
