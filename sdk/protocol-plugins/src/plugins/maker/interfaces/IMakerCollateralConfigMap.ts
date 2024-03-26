import { AddressValue } from '@summerfi/sdk-common/common'
import { IMakerCollateralConfig } from './IMakerCollateralConfig'
import { ICollateralConfigMap } from '@summerfi/sdk-common/protocols'

export type IMakerCollateralConfigRecord = Record<AddressValue, IMakerCollateralConfig>

export interface IMakerCollateralConfigMap extends ICollateralConfigMap {
  record: IMakerCollateralConfigRecord
}
