import { CollateralConfig } from '@summerfi/sdk-common/protocols'
import { ICompoundV3CollateralConfig } from '../interfaces/ICompoundV3CollateralConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export class CompoundV3CollateralConfig extends CollateralConfig implements ICompoundV3CollateralConfig {
  /* EG readonly usageAsCollateralEnabled: boolean */

  private constructor(params: ICompoundV3CollateralConfig) {
    super(params)

    /* EG this.usageAsCollateralEnabled = params.usageAsCollateralEnabled */
  }

  static createFrom(params: ICompoundV3CollateralConfig): CompoundV3CollateralConfig {
    return new CompoundV3CollateralConfig(params)
  }
}

SerializationService.registerClass(CompoundV3CollateralConfig)
