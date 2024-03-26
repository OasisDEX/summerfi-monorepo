import { AddressValue } from '@summerfi/sdk-common/common'
import { IAaveV3CollateralConfig } from './IAaveV3CollateralConfig'
import { ICollateralConfigMap } from '@summerfi/sdk-common/protocols'

export type IAaveV3CollateralConfigRecord = Record<AddressValue, IAaveV3CollateralConfig>

export interface IAaveV3CollateralConfigMap extends ICollateralConfigMap {
  record: IAaveV3CollateralConfigRecord
}
