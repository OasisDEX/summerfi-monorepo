import { AddressValue, IToken, Maybe } from '@summerfi/sdk-common/common'
import { AaveV2CollateralConfig } from './AaveV2CollateralConfig'
import { IAaveV2CollateralConfigMap } from '../interfaces/IAaveV2CollateralConfigMap'
import { CollateralConfigMap } from '@summerfi/sdk-common/protocols'
import { IAaveV2CollateralConfig } from '../interfaces/IAaveV2CollateralConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export type AaveV2CollateralConfigRecord = Record<AddressValue, AaveV2CollateralConfig>

export class AaveV2CollateralConfigMap
  extends CollateralConfigMap
  implements IAaveV2CollateralConfigMap
{
  readonly record: AaveV2CollateralConfigRecord = {}

  private constructor(params: IAaveV2CollateralConfigMap) {
    super(params)

    this._importCollateralConfigMap(params)
  }

  static createFrom(params: IAaveV2CollateralConfigMap): AaveV2CollateralConfigMap {
    return new AaveV2CollateralConfigMap(params)
  }

  public override add(params: {
    collateral: IToken
    collateralConfig: IAaveV2CollateralConfig
  }): void {
    this.record[params.collateral.address.value] = AaveV2CollateralConfig.createFrom(
      params.collateralConfig,
    )
  }

  public override get(params: { token: IToken }): Maybe<AaveV2CollateralConfig> {
    return this.record[params.token.address.value]
  }
}

SerializationService.registerClass(AaveV2CollateralConfigMap)
