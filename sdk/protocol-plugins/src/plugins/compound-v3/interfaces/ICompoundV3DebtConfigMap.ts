import { AddressValue } from '@summerfi/sdk-common/common'
import { ICompoundV3DebtConfig } from './ICompoundV3DebtConfig'
import { IDebtConfigMap } from '@summerfi/sdk-common/protocols'

export type ICompoundV3DebtConfigRecord = Record<AddressValue, ICompoundV3DebtConfig>

export interface ICompoundV3DebtConfigMap extends IDebtConfigMap {
  record: ICompoundV3DebtConfigRecord
}
