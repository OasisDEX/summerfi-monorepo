import { CollateralConfig } from '@summerfi/sdk-common/protocols'
import { ISparkCollateralConfig } from '../interfaces/ISparkCollateralConfig'
import { Percentage, RiskRatio } from '@summerfi/sdk-common/common'

export class SparkCollateralConfig extends CollateralConfig implements ISparkCollateralConfig {
  readonly usageAsCollateralEnabled: boolean
  readonly apy: Percentage
  readonly maxLtv: RiskRatio

  private constructor(params: ISparkCollateralConfig) {
    super(params)

    this.usageAsCollateralEnabled = params.usageAsCollateralEnabled
    this.apy = Percentage.createFrom(params.apy)
    this.maxLtv = RiskRatio.createFrom(params.maxLtv)
  }

  static createFrom(params: ISparkCollateralConfig): SparkCollateralConfig {
    return new SparkCollateralConfig(params)
  }
}
