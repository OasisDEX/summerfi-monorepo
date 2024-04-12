import { AddressValue } from '@summerfi/sdk-common/common'
import { IAaveV2DebtConfig } from './IAaveV2DebtConfig'
import { IDebtConfigMap } from '@summerfi/sdk-common/protocols'

export type IAaveV2DebtConfigRecord = Record<AddressValue, IAaveV2DebtConfig>

export interface IAaveV2DebtConfigMap extends IDebtConfigMap {
  record: IAaveV2DebtConfigRecord
}
