import { CollateralConfig } from '@summerfi/sdk-common/protocols'
import { IMakerCollateralConfig } from '../interfaces/IMakerCollateralConfig'
import { Price } from '@summerfi/sdk-common/common'

export class MakerCollateralConfig extends CollateralConfig implements IMakerCollateralConfig {
  readonly nextPrice: Price
  readonly lastPriceUpdate: Date
  readonly nextPriceUpdate: Date

  private constructor(params: IMakerCollateralConfig) {
    super(params)

    this.nextPrice = Price.createFrom(params.nextPrice)
    this.lastPriceUpdate = params.lastPriceUpdate
    this.nextPriceUpdate = params.nextPriceUpdate
  }

  static createFrom(params: IMakerCollateralConfig): MakerCollateralConfig {
    return new MakerCollateralConfig(params)
  }
}
