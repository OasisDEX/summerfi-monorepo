import { AddressValue, IToken, Maybe } from '@summerfi/sdk-common/common'
import { MakerCollateralConfig } from './MakerCollateralConfig'
import { IMakerCollateralConfigMap } from '../interfaces/IMakerCollateralConfigMap'
import { CollateralConfigMap } from '@summerfi/sdk-common/protocols'
import { IMakerCollateralConfig } from '../interfaces/IMakerCollateralConfig'
import { SerializationService } from '@summerfi/sdk-common/services'

export type MakerCollateralConfigRecord = Record<AddressValue, MakerCollateralConfig>

export class MakerCollateralConfigMap
  extends CollateralConfigMap
  implements IMakerCollateralConfigMap
{
  readonly record: MakerCollateralConfigRecord = {}

  private constructor(params: IMakerCollateralConfigMap) {
    super(params)

    this._importCollateralConfigMap(params)
  }

  static createFrom(params: IMakerCollateralConfigMap): MakerCollateralConfigMap {
    return new MakerCollateralConfigMap(params)
  }

  public override add(params: {
    collateral: IToken
    collateralConfig: IMakerCollateralConfig
  }): void {
    this.record[this._lowerCaseAddress(params.collateral.address.value)] = MakerCollateralConfig.createFrom(
      params.collateralConfig,
    )
  }

  public override get(params: { token: IToken }): Maybe<MakerCollateralConfig> {
    return this.record[this._lowerCaseAddress(params.token.address.value)]
  }
}

SerializationService.registerClass(MakerCollateralConfigMap)
