import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { AddressValue } from '../types/AddressValue'
import { IAddress, IAddressData, __signature__ } from '../interfaces/IAddress'
import { AddressType } from '../enums/AddressType'

/**
 * Type for the parameters of Address
 */
export type AddressParameters = Omit<IAddressData, ''>

/**
 * @class Address
 * @see IAddress
 */
export class Address implements IAddress {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly value: AddressValue
  readonly type: AddressType

  /** CONSTANTS */
  public static ZeroAddressEthereum: Address = new Address({
    value: '0x0000000000000000000000000000000000000000',
    type: AddressType.Ethereum,
  })

  /** FACTORY METHODS */

  static createFrom(params: AddressParameters): Address {
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
  private constructor(params: AddressParameters) {
    if (Address.isValid(params.value) === false) {
      throw new Error('Address value is invalid: ' + params.value)
    }

    this.value = params.value
    this.type = params.type
  }

  /** PUBLIC METHODS */
  equals(address: Address): boolean {
    return this.value.toLowerCase() === address.value.toLowerCase() && this.type === address.type
  }

  /** @see IValueConverter.toBigNumber */
  toSolidityValue(_: { decimals: number }): bigint {
    return BigInt(this.value)
  }

  /** @see IValueConverter.toBigNumber */
  toBigNumber(): BigNumber {
    return new BigNumber(this.value)
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `${this.value} (${this.type})`
  }
}

SerializationService.registerClass(Address, { identifier: 'Address' })
