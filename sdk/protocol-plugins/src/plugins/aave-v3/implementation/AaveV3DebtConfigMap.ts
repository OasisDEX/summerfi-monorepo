import { AddressValue, IToken, Maybe } from '@summerfi/sdk-common/common'
import { AaveV3DebtConfig } from './AaveV3DebtConfig'
import { IAaveV3DebtConfigMap } from '../interfaces/IAaveV3DebtConfigMap'
import { DebtConfigMap } from '@summerfi/sdk-common/protocols'
import { IAaveV3DebtConfig } from '../interfaces/IAaveV3DebtConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export type AaveV3DebtConfigRecord = Record<AddressValue, AaveV3DebtConfig>

export class AaveV3DebtConfigMap extends DebtConfigMap implements IAaveV3DebtConfigMap {
  readonly record: AaveV3DebtConfigRecord = {}

  private constructor(params: IAaveV3DebtConfigMap) {
    super(params)

    this._importDebtConfigMap(params)
  }

  static createFrom(params: IAaveV3DebtConfigMap): AaveV3DebtConfigMap {
    return new AaveV3DebtConfigMap(params)
  }

  public override add(params: { debt: IToken; debtConfig: IAaveV3DebtConfig }): void {
    this.record[this._formatRecordKey(params.debt.address.value)] = AaveV3DebtConfig.createFrom(params.debtConfig)
  }

  public override get(params: { token: IToken }): Maybe<AaveV3DebtConfig> {
    return this.record[this._formatRecordKey(params.token.address.value)]
  }
}

SerializationService.registerClass(AaveV3DebtConfigMap)
