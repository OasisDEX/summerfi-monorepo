import { AddressValue } from '../../common/aliases/AddressValue'
import { Maybe } from '../../common/aliases/Maybe'
import { IToken } from '../../common/interfaces/IToken'

import { IDebtConfig } from '../interfaces/IDebtConfig'
import { IDebtConfigMap } from '../interfaces/IDebtConfigMap'
import { DebtConfig } from './DebtConfig'

export type DebtConfigRecord = Record<AddressValue, DebtConfig>

export class DebtConfigMap implements IDebtConfigMap {
  readonly record: DebtConfigRecord = {}

  protected constructor(params: IDebtConfigMap) {
    this._importDebtConfigMap(params)
  }

  static createFrom(params: IDebtConfigMap): DebtConfigMap {
    return new DebtConfigMap(params)
  }

  public add(params: { debt: IToken; debtConfig: IDebtConfig }): void {
    this.record[params.debt.address.value] = DebtConfig.createFrom(params.debtConfig)
  }

  public get(params: { token: IToken }): Maybe<DebtConfig> {
    return this.record[params.token.address.value]
  }

  protected _importDebtConfigMap(params: IDebtConfigMap): void {
    return Object.entries(params.record).forEach(([, debtConfig]) => {
      this.add({ debt: debtConfig.token, debtConfig })
    })
  }
}
