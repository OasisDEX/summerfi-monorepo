import { AddressValue } from '@summerfi/sdk-common/common'
import { IMakerDebtConfig } from './IMakerDebtConfig'

export type IMakerDebtConfigRecord = Record<AddressValue, IMakerDebtConfig>

export interface IMakerDebtConfigMap {
  record: IMakerDebtConfigRecord
}
