import { CollateralConfig } from '@summerfi/sdk-common/protocols'
import { IAaveV2CollateralConfig } from '../interfaces/IAaveV2CollateralConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export class AaveV2CollateralConfig extends CollateralConfig implements IAaveV2CollateralConfig {
  /* EG readonly usageAsCollateralEnabled: boolean */

  private constructor(params: IAaveV2CollateralConfig) {
    super(params)

    /* EG this.usageAsCollateralEnabled = params.usageAsCollateralEnabled */
  }

  static createFrom(params: IAaveV2CollateralConfig): AaveV2CollateralConfig {
    return new AaveV2CollateralConfig(params)
  }
}

SerializationService.registerClass(AaveV2CollateralConfig)
