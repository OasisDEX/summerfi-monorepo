import { AddressValue, IToken, Maybe } from '@summerfi/sdk-common/common'
import { SparkCollateralConfig } from './SparkCollateralConfig'
import { ISparkCollateralConfigMap } from '../interfaces/ISparkCollateralConfigMap'
import { CollateralConfigMap } from '@summerfi/sdk-common/protocols'
import { ISparkCollateralConfig } from '../interfaces/ISparkCollateralConfig'

export type SparkCollateralConfigRecord = Record<AddressValue, SparkCollateralConfig>

export class SparkCollateralConfigMap
  extends CollateralConfigMap
  implements ISparkCollateralConfigMap
{
  readonly record: SparkCollateralConfigRecord = {}

  private constructor(params: ISparkCollateralConfigMap) {
    super(params)

    this._importCollateralConfigMap(params)
  }

  static createFrom(params: ISparkCollateralConfigMap): SparkCollateralConfigMap {
    return new SparkCollateralConfigMap(params)
  }

  public override add(params: {
    collateral: IToken
    collateralConfig: ISparkCollateralConfig
  }): void {
    this.record[params.collateral.address.value] = SparkCollateralConfig.createFrom(
      params.collateralConfig,
    )
  }

  public override get(params: { token: IToken }): Maybe<SparkCollateralConfig> {
    return this.record[params.token.address.value]
  }
}
