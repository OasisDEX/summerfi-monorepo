import { DebtConfig } from '@summerfi/sdk-common/protocols'
import { IMakerDebtConfig } from '../interfaces/IMakerDebtConfig'

export class MakerDebtConfig extends DebtConfig implements IMakerDebtConfig {
  private constructor(params: IMakerDebtConfig) {
    super(params)
  }

  static createFrom(params: IMakerDebtConfig): MakerDebtConfig {
    return new MakerDebtConfig(params)
  }
}
