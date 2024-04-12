import { DebtConfig } from '@summerfi/sdk-common/protocols'
import { IAaveV2DebtConfig } from '../interfaces/IAaveV2DebtConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export class AaveV2DebtConfig extends DebtConfig implements IAaveV2DebtConfig {
  /* EG readonly borrowingEnabled: boolean */

  private constructor(params: IAaveV2DebtConfig) {
    super(params)

    /* EG this.borrowingEnabled = params.borrowingEnabled */
  }

  static createFrom(params: IAaveV2DebtConfig): AaveV2DebtConfig {
    return new AaveV2DebtConfig(params)
  }
}

SerializationService.registerClass(AaveV2DebtConfig)
