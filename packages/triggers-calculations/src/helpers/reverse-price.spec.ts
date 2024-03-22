import { Price, PRICE_DECIMALS, PRICE_DECIMALS_NUMBER } from '@summerfi/triggers-shared'
import { reversePrice } from './reverse-price'

describe('Reverse Price', () => {
  it('Should reverse the price', () => {
    const price: Price = 2000n * 10n ** PRICE_DECIMALS
    const expectedResult: Price = BigInt(0.0005 * 10 ** PRICE_DECIMALS_NUMBER)
    const result = reversePrice(price)
    expect(result).toEqual(expectedResult)
  })
})
