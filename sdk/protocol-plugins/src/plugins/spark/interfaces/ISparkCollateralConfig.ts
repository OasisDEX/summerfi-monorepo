import { IPercentage, IRiskRatio } from '@summerfi/sdk-common/common'
import { ICollateralConfig } from '@summerfi/sdk-common/protocols'

export interface ISparkCollateralConfig extends ICollateralConfig {
  usageAsCollateralEnabled: boolean
  apy: IPercentage
  maxLtv: IRiskRatio
}
