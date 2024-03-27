import { AddressValue } from '../../common/aliases/AddressValue'
import { ICollateralConfig } from './ICollateralConfig'

export type ICollateralConfigRecord = Record<AddressValue, ICollateralConfig>

export interface ICollateralConfigMap {
  record: ICollateralConfigRecord
}
