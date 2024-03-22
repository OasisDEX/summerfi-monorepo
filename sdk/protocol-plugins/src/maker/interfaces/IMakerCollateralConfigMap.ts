import { AddressValue } from '@summerfi/sdk-common/common'
import { IMakerCollateralConfig } from './IMakerCollateralConfig'

export type IMakerCollateralConfigRecord = Record<AddressValue, IMakerCollateralConfig>

export interface IMakerCollateralConfigMap {
  record: IMakerCollateralConfigRecord
}
