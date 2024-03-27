import { AddressValue } from '@summerfi/sdk-common/common'
import { ISparkCollateralConfig } from './ISparkCollateralConfig'
import { ICollateralConfigMap } from '@summerfi/sdk-common/protocols'

export type ISparkCollateralConfigRecord = Record<AddressValue, ISparkCollateralConfig>

export interface ISparkCollateralConfigMap extends ICollateralConfigMap {
  record: ISparkCollateralConfigRecord
}
