import { AddressValue } from '../../common/aliases/AddressValue'
import { IDebtConfig } from './IDebtConfig'

export type IDebtConfigRecord = Record<AddressValue, IDebtConfig>

export interface IDebtConfigMap {
  record: IDebtConfigRecord
}
