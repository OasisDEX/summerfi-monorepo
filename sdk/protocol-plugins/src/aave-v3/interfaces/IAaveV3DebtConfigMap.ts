import { AddressValue } from '@summerfi/sdk-common/common'
import { IAaveV3DebtConfig } from './IAaveV3DebtConfig'

export type IAaveV3DebtConfigRecord = Record<AddressValue, IAaveV3DebtConfig>

export interface IAaveV3DebtConfigMap {
  record: IAaveV3DebtConfigRecord
}
