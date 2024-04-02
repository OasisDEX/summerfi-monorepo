import { AddressValue } from '../aliases/AddressValue'
import { AddressType } from '../enums/AddressType'

export interface IAddress {
  value: AddressValue
  type: AddressType
}
