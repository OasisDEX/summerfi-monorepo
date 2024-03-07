import { AddressType } from '~sdk-common/common/enums'
import { AddressValue } from '~sdk-common/common/aliases'
import { SerializationService } from '~sdk-common/services/SerializationService'

interface IAddressSerialized {
  value: AddressValue
  type: AddressType
}

/**
 * @class Address
 * @description Represents a blockchain address, including its type
 */
export class Address implements IAddressSerialized {
  public static ZeroAddressEthereum: Address = new Address({
    value: '0x0000000000000000000000000000000000000000',
    type: AddressType.Ethereum,
  })

  readonly value: AddressValue
  readonly type: AddressType

  private constructor(params: IAddressSerialized) {
    this.value = params.value
    this.type = params.type
  }

  static createFrom({ value }: { value: AddressValue }): Address {
    if (this.isValid(value) === false) {
      throw new Error('value is invalid')
    }

    const type = this.getType(value)

    return new Address({ value, type })
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

  equals(address: Address): boolean {
    return this.value === address.value;
  }

  toString(): string {
    return `${this.value} (${this.type})`
  }
}

SerializationService.registerClass(Address)
