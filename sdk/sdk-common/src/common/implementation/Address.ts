import { AddressType } from '~sdk-common/common/enums'
import { SerializationManager } from '~sdk-common/common/managers'

interface IAddressSerialized {
  hexValue: string
  type: AddressType
}

/**
 * @class Address
 * @description Represents a blockchain address, including its type
 */
export class Address implements IAddressSerialized {
  readonly hexValue: string
  readonly type: AddressType

  private constructor(params: IAddressSerialized) {
    this.hexValue = params.hexValue
    this.type = params.type
  }

  static createFrom({ hexValue }: { hexValue: string }): Address {
    if (this.isValid(hexValue) === false) {
      throw new Error('hexValue is invalid')
    }

    const type = this.getType(hexValue)

    return new Address({ hexValue, type })
  }

  static isValid(address: string): boolean {
    const type = this.getType(address)
    return type !== AddressType.Unknown
  }

  static getType(address: string): AddressType {
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return AddressType.Ethereum
    }
    return AddressType.Unknown
  }

  toString(): string {
    return `${this.hexValue} (${this.type})`
  }
}

SerializationManager.registerClass(Address)
