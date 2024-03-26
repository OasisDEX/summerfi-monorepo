import { AddressValue } from '@summerfi/sdk-common/common'
import { ISparkDebtConfig } from './ISparkDebtConfig'
import { IDebtConfigMap } from '@summerfi/sdk-common/protocols'

export type ISparkDebtConfigRecord = Record<AddressValue, ISparkDebtConfig>

export interface ISparkDebtConfigMap extends IDebtConfigMap {
  record: ISparkDebtConfigRecord
}
