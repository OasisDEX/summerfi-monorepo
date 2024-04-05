import { CollateralConfig } from '@summerfi/sdk-common/protocols'
import { IAaveV3CollateralConfig } from '../interfaces/IAaveV3CollateralConfig'
import { Percentage, RiskRatio } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

export class AaveV3CollateralConfig extends CollateralConfig implements IAaveV3CollateralConfig {
  readonly usageAsCollateralEnabled: boolean
  readonly apy: Percentage
  readonly maxLtv: RiskRatio

  private constructor(params: IAaveV3CollateralConfig) {
    super(params)

    this.usageAsCollateralEnabled = params.usageAsCollateralEnabled
    this.apy = Percentage.createFrom(params.apy)
    this.maxLtv = RiskRatio.createFrom(params.maxLtv)
  }

  static createFrom(params: IAaveV3CollateralConfig): AaveV3CollateralConfig {
    return new AaveV3CollateralConfig(params)
  }
}

SerializationService.registerClass(AaveV3CollateralConfig)
