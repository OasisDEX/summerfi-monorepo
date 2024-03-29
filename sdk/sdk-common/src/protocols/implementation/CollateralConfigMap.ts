import { AddressValue } from '../../common/aliases/AddressValue'
import { Maybe } from '../../common/aliases/Maybe'
import { IToken } from '../../common/interfaces/IToken'
import { ICollateralConfig } from '../interfaces/ICollateralConfig'
import { ICollateralConfigMap } from '../interfaces/ICollateralConfigMap'
import { CollateralConfig } from './CollateralConfig'

export type CollateralConfigRecord = Record<AddressValue, CollateralConfig>

export class CollateralConfigMap implements ICollateralConfigMap {
  readonly record: CollateralConfigRecord = {}

  protected constructor(params: ICollateralConfigMap) {
    this._importCollateralConfigMap(params)
  }

  static createFrom(params: ICollateralConfigMap): CollateralConfigMap {
    return new CollateralConfigMap(params)
  }

  public add(params: { collateral: IToken; collateralConfig: ICollateralConfig }): void {
    this.record[params.collateral.address.value] = CollateralConfig.createFrom(
      params.collateralConfig,
    )
  }

  public get(params: { token: IToken }): Maybe<CollateralConfig> {
    return this.record[params.token.address.value]
  }

  protected _importCollateralConfigMap(params: ICollateralConfigMap): void {
    return Object.entries(params.record).forEach(([, collateralConfig]) => {
      this.add({ collateral: collateralConfig.token, collateralConfig })
    })
  }
}
