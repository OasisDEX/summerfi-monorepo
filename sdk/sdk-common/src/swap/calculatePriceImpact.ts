import { Percentage } from '../common/implementation/Percentage'
import { IPrice } from '../common/interfaces/IPrice'
import { IPercentage } from '../common/interfaces/IPercentage'

/**
 *
 * @param spotPrice - This price represents a blend of spot prices from various exchanges.
 * @param quotePrice - The offer price is price quoted to us by a liquidity provider and takes
 *      into account price impact - where price impact is a measure of how much our trade
 *      affects the price. It is determined by the breadth and depth of liquidity.
 */
export function calculatePriceImpact(spotPrice: IPrice, quotePrice: IPrice): IPercentage {
  const val = spotPrice
    .toBigNumber()
    .minus(quotePrice.toBigNumber())
    .div(spotPrice.toBigNumber())
    .times(100)
    .toNumber()
  return Percentage.createFrom({
    value: val < 0 ? 0 : val,
  })
}
