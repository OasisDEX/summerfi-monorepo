import { AddressValue } from '@summerfi/sdk-common/common'
import { IAaveV3DebtConfig } from './IAaveV3DebtConfig'
import { IDebtConfigMap } from '@summerfi/sdk-common/protocols'

export type IAaveV3DebtConfigRecord = Record<AddressValue, IAaveV3DebtConfig>

export interface IAaveV3DebtConfigMap extends IDebtConfigMap {
  record: IAaveV3DebtConfigRecord
}
