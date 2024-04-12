import { AddressValue } from '@summerfi/sdk-common/common'
import {ICollateralConfigMap} from "@summerfi/sdk-common/protocols";
import { IAaveV2CollateralConfig } from './IAaveV2CollateralConfig'

export type IAaveV2CollateralConfigRecord = Record<AddressValue, IAaveV2CollateralConfig>

export interface IAaveV2CollateralConfigMap extends ICollateralConfigMap {
  record: IAaveV2CollateralConfigRecord
}
