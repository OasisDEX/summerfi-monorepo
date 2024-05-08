import { DebtConfig } from '@summerfi/sdk-common/protocols'
import { ICompoundV3DebtConfig } from '../interfaces/ICompoundV3DebtConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export class CompoundV3DebtConfig extends DebtConfig implements ICompoundV3DebtConfig {
  /* EG readonly borrowingEnabled: boolean */


  private constructor(params: ICompoundV3DebtConfig) {
    super(params)

    /* EG this.borrowingEnabled = params.borrowingEnabled */
  }

  static createFrom(params: ICompoundV3DebtConfig): CompoundV3DebtConfig {
    return new CompoundV3DebtConfig(params)
  }
}

SerializationService.registerClass(CompoundV3DebtConfig)
