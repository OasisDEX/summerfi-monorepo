import { HexData } from '../../common/aliases/HexData'
import { AddressValue } from '../../common/aliases/AddressValue'
import { Maybe } from '../../common/aliases/Maybe'
import { ITokenData } from '../../common/interfaces/IToken'
import { SerializationService } from '../../services/SerializationService'

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

  public add(params: { debt: ITokenData; debtConfig: IDebtConfig }): void {
    this.record[this._formatRecordKey(params.debt.address.value)] = DebtConfig.createFrom(
      params.debtConfig,
    )
  }

  public get(params: { token: ITokenData }): Maybe<DebtConfig> {
    return this.record[this._formatRecordKey(params.token.address.value)]
  }

  protected _importDebtConfigMap(params: IDebtConfigMap): void {
    return Object.entries(params.record).forEach(([, debtConfig]) => {
      this.add({ debt: debtConfig.token, debtConfig })
    })
  }

  protected _formatRecordKey(address: HexData) {
    return address.toLowerCase() as HexData
  }
}

SerializationService.registerClass(DebtConfigMap)
