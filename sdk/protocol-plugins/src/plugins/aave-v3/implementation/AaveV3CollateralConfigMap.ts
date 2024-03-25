import { AddressValue, IToken, Maybe } from '@summerfi/sdk-common/common'
import { AaveV3CollateralConfig } from './AaveV3CollateralConfig'
import { IAaveV3CollateralConfigMap } from '../interfaces/IAaveV3CollateralConfigMap'
import { CollateralConfigMap } from '@summerfi/sdk-common/protocols'
import { IAaveV3CollateralConfig } from '../interfaces/IAaveV3CollateralConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export type AaveV3CollateralConfigRecord = Record<AddressValue, AaveV3CollateralConfig>

export class AaveV3CollateralConfigMap
  extends CollateralConfigMap
  implements IAaveV3CollateralConfigMap
{
  readonly record: AaveV3CollateralConfigRecord = {}

  private constructor(params: IAaveV3CollateralConfigMap) {
    super(params)

    this._importCollateralConfigMap(params)
  }

  static createFrom(params: IAaveV3CollateralConfigMap): AaveV3CollateralConfigMap {
    return new AaveV3CollateralConfigMap(params)
  }

  public override add(params: {
    collateral: IToken
    collateralConfig: IAaveV3CollateralConfig
  }): void {
    this.record[params.collateral.address.value] = AaveV3CollateralConfig.createFrom(
      params.collateralConfig,
    )
  }

  public override get(params: { token: IToken }): Maybe<AaveV3CollateralConfig> {
    return this.record[params.token.address.value]
  }
}

SerializationService.registerClass(AaveV3CollateralConfigMap)
