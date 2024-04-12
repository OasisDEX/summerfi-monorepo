import { AddressValue, IToken, Maybe } from '@summerfi/sdk-common/common'
import { AaveV2DebtConfig } from './AaveV2DebtConfig'
import { IAaveV2DebtConfigMap } from '../interfaces/IAaveV2DebtConfigMap'
import { DebtConfigMap } from '@summerfi/sdk-common/protocols'
import { IAaveV2DebtConfig } from '../interfaces/IAaveV2DebtConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export type AaveV2DebtConfigRecord = Record<AddressValue, AaveV2DebtConfig>

export class AaveV2DebtConfigMap extends DebtConfigMap implements IAaveV2DebtConfigMap {
  readonly record: AaveV2DebtConfigRecord = {}

  private constructor(params: IAaveV2DebtConfigMap) {
    super(params)

    this._importDebtConfigMap(params)
  }

  static createFrom(params: IAaveV2DebtConfigMap): AaveV2DebtConfigMap {
    return new AaveV2DebtConfigMap(params)
  }

  public override add(params: { debt: IToken; debtConfig: IAaveV2DebtConfig }): void {
    this.record[params.debt.address.value] = AaveV2DebtConfig.createFrom(params.debtConfig)
  }

  public override get(params: { token: IToken }): Maybe<AaveV2DebtConfig> {
    return this.record[params.token.address.value]
  }
}

SerializationService.registerClass(AaveV2DebtConfigMap)
