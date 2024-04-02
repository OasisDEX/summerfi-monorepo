import { DebtConfig } from '@summerfi/sdk-common/protocols'
import { IMakerDebtConfig } from '../interfaces/IMakerDebtConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export class MakerDebtConfig extends DebtConfig implements IMakerDebtConfig {
  private constructor(params: IMakerDebtConfig) {
    super(params)
  }

  static createFrom(params: IMakerDebtConfig): MakerDebtConfig {
    return new MakerDebtConfig(params)
  }
}

SerializationService.registerClass(MakerDebtConfig)
