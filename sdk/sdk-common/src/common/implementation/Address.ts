import { SerializationService } from '../../services/SerializationService'
import { AddressValue } from '../aliases/AddressValue'
import { IAddress, IAddressParameters } from '../interfaces/IAddress'
import { AddressType } from '../types/AddressType'

/**
 * @class Address
 * @see IAddressData
 */
export class Address implements IAddress {
  readonly _signature_0 = 'IAddress'

  public static ZeroAddressEthereum: Address = new Address({
    value: '0x0000000000000000000000000000000000000000',
    type: AddressType.Ethereum,
  })

  readonly value: AddressValue
  readonly type: AddressType

  /** FACTORY METHODS */

  static createFrom(params: IAddressParameters): Address {
    return new Address(params)
  }

  static createFromEthereum(params: { value: string }): Address {
    return new Address({ value: params.value as AddressValue, type: AddressType.Ethereum })
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

  /** CONSTRUCTOR */
  private constructor(params: IAddressParameters) {
    if (Address.isValid(params.value) === false) {
      throw new Error('Address value is invalid')
    }

    this.value = params.value
    this.type = params.type
  }

  /** PUBLIC METHODS */
  equals(address: Address): boolean {
    return this.value.toLowerCase() === address.value.toLowerCase() && this.type === address.type
  }

  toString(): string {
    return `${this.value} (${this.type})`
  }
}

SerializationService.registerClass(Address)
