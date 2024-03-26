import { AddressValue } from '@summerfi/sdk-common/common'
import { IMakerDebtConfig } from './IMakerDebtConfig'
import { IDebtConfigMap } from '@summerfi/sdk-common/protocols'

export type IMakerDebtConfigRecord = Record<AddressValue, IMakerDebtConfig>

export interface IMakerDebtConfigMap extends IDebtConfigMap {
  record: IMakerDebtConfigRecord
}
