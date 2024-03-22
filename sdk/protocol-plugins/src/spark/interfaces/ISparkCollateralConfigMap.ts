import { AddressValue } from '@summerfi/sdk-common/common'
import { ISparkCollateralConfig } from './ISparkCollateralConfig'

export type ISparkCollateralConfigRecord = Record<AddressValue, ISparkCollateralConfig>

export interface ISparkCollateralConfigMap {
  record: ISparkCollateralConfigRecord
}
