import { Price, PRICE_DECIMALS } from '~types'

export const reversePrice = (price: Price): Price => {
  return 10n ** (PRICE_DECIMALS * 2n) / price
}
