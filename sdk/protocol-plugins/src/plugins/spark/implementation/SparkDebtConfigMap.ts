import { AddressValue, IToken, Maybe } from '@summerfi/sdk-common/common'
import { SparkDebtConfig } from './SparkDebtConfig'
import { ISparkDebtConfigMap } from '../interfaces/ISparkDebtConfigMap'
import { DebtConfigMap } from '@summerfi/sdk-common/protocols'
import { ISparkDebtConfig } from '../interfaces/ISparkDebtConfig'

export type SparkDebtConfigRecord = Record<AddressValue, SparkDebtConfig>

export class SparkDebtConfigMap extends DebtConfigMap implements ISparkDebtConfigMap {
  readonly record: SparkDebtConfigRecord = {}

  private constructor(params: ISparkDebtConfigMap) {
    super(params)

    this._importDebtConfigMap(params)
  }

  static createFrom(params: ISparkDebtConfigMap): SparkDebtConfigMap {
    return new SparkDebtConfigMap(params)
  }

  public override add(params: { debt: IToken; debtConfig: ISparkDebtConfig }): void {
    this.record[params.debt.address.value] = SparkDebtConfig.createFrom(params.debtConfig)
  }

  public override get(params: { token: IToken }): Maybe<SparkDebtConfig> {
    return this.record[params.token.address.value]
  }
}
