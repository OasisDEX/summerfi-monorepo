import { DebtConfig } from '@summerfi/sdk-common/protocols'
import { IAaveV3DebtConfig } from '../interfaces/IAaveV3DebtConfig'

export class AaveV3DebtConfig extends DebtConfig implements IAaveV3DebtConfig {
  readonly borrowingEnabled: boolean

  private constructor(params: IAaveV3DebtConfig) {
    super(params)

    this.borrowingEnabled = params.borrowingEnabled
  }

  static createFrom(params: IAaveV3DebtConfig): AaveV3DebtConfig {
    return new AaveV3DebtConfig(params)
  }
}
