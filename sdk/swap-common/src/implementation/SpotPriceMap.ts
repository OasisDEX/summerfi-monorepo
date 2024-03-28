import {
  Price,
  type IPrice,
  type IToken,
  type Maybe,
  type AddressValue,
} from '@summerfi/sdk-common/common'
import { ISpotPriceMap, ISpotPriceMapRecord } from '../interfaces/ISpotPriceMap'

export class SpotPriceMap implements ISpotPriceMap {
  readonly record: ISpotPriceMapRecord = {}

  private constructor(params: ISpotPriceMap) {
    this._createSpotPriceMap(params)
  }

  static createFrom(params: Price): SpotPriceMap {
    return new SpotPriceMap(params)
  }

  public add(params: { price: IPrice }): void {
    this.record[params.price.baseToken.address.value as AddressValue] = Price.createFrom(
      params.price,
    )
  }

  public get(params: { token: IToken }): Maybe<Price> {
    return this.record[params.token.address.value]
  }

  private _createSpotPriceMap(params: ISpotPriceMap): void {
    return Object.entries(params.record).forEach(([, price]) => {
      this.add({ price })
    })
  }
}
