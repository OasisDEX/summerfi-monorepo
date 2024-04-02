import { IPrice } from '@summerfi/sdk-common/common'
import { ICollateralConfig } from '@summerfi/sdk-common/protocols'

export interface IMakerCollateralConfig extends ICollateralConfig {
  nextPrice: IPrice
  lastPriceUpdate: Date
  nextPriceUpdate: Date
}
