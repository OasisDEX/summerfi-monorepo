import { AddressValue, IToken, Maybe } from '@summerfi/sdk-common/common'
import { CompoundV3DebtConfig } from './CompoundV3DebtConfig'
import { ICompoundV3DebtConfigMap } from '../interfaces/ICompoundV3DebtConfigMap'
import { DebtConfigMap } from '@summerfi/sdk-common/protocols'
import { ICompoundV3DebtConfig } from '../interfaces/ICompoundV3DebtConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export type CompoundV3DebtConfigRecord = Record<AddressValue, CompoundV3DebtConfig>

export class CompoundV3DebtConfigMap extends DebtConfigMap implements ICompoundV3DebtConfigMap {
  readonly record: CompoundV3DebtConfigRecord = {}

  private constructor(params: ICompoundV3DebtConfigMap) {
    super(params)

    this._importDebtConfigMap(params)
  }

  static createFrom(params: ICompoundV3DebtConfigMap): CompoundV3DebtConfigMap {
    return new CompoundV3DebtConfigMap(params)
  }

  public override add(params: { debt: IToken; debtConfig: ICompoundV3DebtConfig }): void {
    this.record[params.debt.address.value] = CompoundV3DebtConfig.createFrom(params.debtConfig)
  }

  public override get(params: { token: IToken }): Maybe<CompoundV3DebtConfig> {
    return this.record[params.token.address.value]
  }
}

SerializationService.registerClass(CompoundV3DebtConfigMap)
