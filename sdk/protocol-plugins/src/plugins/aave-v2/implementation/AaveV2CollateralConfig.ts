import {CollateralConfig} from "@summerfi/sdk-common/protocols";
import { IAaveV2CollateralConfig } from '../interfaces/IAaveV2CollateralConfig'
import { Percentage, RiskRatio } from '@summerfi/sdk-common/common'
import { SerializationService } from '@summerfi/sdk-common/services'

export class AaveV2CollateralConfig extends CollateralConfig implements IAaveV2CollateralConfig {
  readonly usageAsCollateralEnabled: boolean
  readonly apy: Percentage
  readonly maxLtv: RiskRatio

  private constructor(params: IAaveV2CollateralConfig) {
    super(params)

    this.usageAsCollateralEnabled = params.usageAsCollateralEnabled
    this.apy = Percentage.createFrom(params.apy)
    this.maxLtv = RiskRatio.createFrom(params.maxLtv)
  }

  static createFrom(params: IAaveV2CollateralConfig): AaveV2CollateralConfig {
    return new AaveV2CollateralConfig(params)
  }
}

SerializationService.registerClass(AaveV2CollateralConfig)
