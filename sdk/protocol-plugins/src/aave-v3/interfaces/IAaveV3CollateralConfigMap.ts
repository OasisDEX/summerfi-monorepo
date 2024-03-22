import { AddressValue } from '@summerfi/sdk-common/common'
import { IAaveV3CollateralConfig } from './IAaveV3CollateralConfig'

export type IAaveV3CollateralConfigRecord = Record<AddressValue, IAaveV3CollateralConfig>

export interface IAaveV3CollateralConfigMap {
  record: IAaveV3CollateralConfigRecord
}
