import { IPercentage, IRiskRatio } from '@summerfi/sdk-common/common'
import { ICollateralConfig } from '@summerfi/sdk-common/protocols'

export interface IAaveV3CollateralConfig extends ICollateralConfig {
  usageAsCollateralEnabled: boolean
  apy: IPercentage
  maxLtv: IRiskRatio
}
