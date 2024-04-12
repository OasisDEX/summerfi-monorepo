import { AddressValue } from '@summerfi/sdk-common/common'
import { IAaveV2CollateralConfig } from './IAaveV2CollateralConfig'
import { IAaveV2CollateralConfigMap } from '@summerfi/sdk-common/protocols'

export type IAaveV2CollateralConfigRecord = Record<AddressValue, IAaveV2CollateralConfig>

export interface IAaveV2CollateralConfigMap extends ICollateralConfigMap {
  record: IAaveV2CollateralConfigRecord
}
