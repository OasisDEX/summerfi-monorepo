import { AddressValue, IToken, Maybe } from '@summerfi/sdk-common/common'
import { MakerDebtConfig } from './MakerDebtConfig'
import { IMakerDebtConfigMap } from '../interfaces/IMakerDebtConfigMap'
import { DebtConfigMap } from '@summerfi/sdk-common/protocols'
import { IMakerDebtConfig } from '../interfaces/IMakerDebtConfig'

export type MakerDebtConfigRecord = Record<AddressValue, MakerDebtConfig>

export class MakerDebtConfigMap extends DebtConfigMap implements IMakerDebtConfigMap {
  readonly record: MakerDebtConfigRecord = {}

  private constructor(params: IMakerDebtConfigMap) {
    super(params)

    this._importDebtConfigMap(params)
  }

  static createFrom(params: IMakerDebtConfigMap): MakerDebtConfigMap {
    return new MakerDebtConfigMap(params)
  }

  public override add(params: { debt: IToken; debtConfig: IMakerDebtConfig }): void {
    this.record[params.debt.address.value] = MakerDebtConfig.createFrom(params.debtConfig)
  }

  public override get(params: { token: IToken }): Maybe<MakerDebtConfig> {
    return this.record[params.token.address.value]
  }
}
