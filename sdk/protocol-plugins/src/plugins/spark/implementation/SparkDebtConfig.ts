import { DebtConfig } from '@summerfi/sdk-common/protocols'
import { ISparkDebtConfig } from '../interfaces/ISparkDebtConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export class SparkDebtConfig extends DebtConfig implements ISparkDebtConfig {
  readonly borrowingEnabled: boolean

  private constructor(params: ISparkDebtConfig) {
    super(params)

    this.borrowingEnabled = params.borrowingEnabled
  }

  static createFrom(params: ISparkDebtConfig): SparkDebtConfig {
    return new SparkDebtConfig(params)
  }
}

SerializationService.registerClass(SparkDebtConfig)
