import { AddressValue } from '@summerfi/sdk-common/common'
import { ISparkDebtConfig } from './ISparkDebtConfig'

export type ISparkDebtConfigRecord = Record<AddressValue, ISparkDebtConfig>

export interface ISparkDebtConfigMap {
  record: ISparkDebtConfigRecord
}
