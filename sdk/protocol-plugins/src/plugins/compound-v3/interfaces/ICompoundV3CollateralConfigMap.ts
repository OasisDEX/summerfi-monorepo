import { AddressValue } from '@summerfi/sdk-common/common'
import { ICompoundV3CollateralConfig } from './ICompoundV3CollateralConfig'
import { ICollateralConfigMap } from '@summerfi/sdk-common/protocols'

export type ICompoundV3CollateralConfigRecord = Record<AddressValue, ICompoundV3CollateralConfig>

export interface ICompoundV3CollateralConfigMap extends ICollateralConfigMap {
  record: ICompoundV3CollateralConfigRecord
}
