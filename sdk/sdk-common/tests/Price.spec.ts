import assert from 'assert'
import {
  Address,
  ChainInfo,
  FiatCurrency,
  FiatCurrencyAmount,
  IToken,
  Price,
  Token,
  TokenAmount,
  isFiatCurrency,
  isFiatCurrencyAmount,
  isToken,
  isTokenAmount,
} from '../src'

describe('SDK Common | Price', () => {
  let USDC: IToken
  let DAI: IToken

  beforeAll(() => {
    USDC = Token.createFrom({
      address: Address.createFromEthereum({
        value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      }),
      chainInfo: ChainInfo.createFrom({
        chainId: 1,
        name: 'Ethereum',
      }),
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
    })

    DAI = Token.createFrom({
      address: Address.createFromEthereum({
        value: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      }),
      chainInfo: ChainInfo.createFrom({
        chainId: 1,
        name: 'Ethereum',
      }),
      decimals: 18,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
    })
  })

  describe('#createFrom()', () => {
    it('should instantiate with base/quote tokens', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      expect(price.value).toEqual('108.54')
      if (!isToken(price.base)) {
        fail('Price base is not a token')
      }
      expect(price.base.equals(USDC)).toBeTruthy()
      if (!isToken(price.quote)) {
        fail('Price quote is not a token')
      }
      expect(price.quote.equals(DAI)).toBeTruthy()
    })

    it('should instantiate with base/quote fiat currency', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: FiatCurrency.USD,
        quote: FiatCurrency.USD,
      })

      expect(price.value).toEqual('108.54')
      if (!isFiatCurrency(price.base)) {
        fail('Price base is not a fiat currency')
      }
      expect(price.base).toEqual(FiatCurrency.USD)
      if (!isFiatCurrency(price.quote)) {
        fail('Price quote is not a fiat currency')
      }
      expect(price.quote).toEqual(FiatCurrency.USD)
    })
  })

  describe('#hasSameBase()', () => {
    it('should return true if the bases are the same', () => {
      const price1 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      expect(price1.hasSameBase(price2)).toBeTruthy()
    })

    it('should return false if the bases are different', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: USDC,
      })

      expect(price.hasSameBase(price2)).toBeFalsy()
    })
  })

  describe('#hasSameQuote()', () => {
    it('should return true if the quotes are tokens and are the same', () => {
      const price1 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      expect(price1.hasSameQuote(price2)).toBeTruthy()
    })

    it('should return true if the quotes are fiat currencies and are the same', () => {
      const price1 = Price.createFrom({
        value: '108.54',
        base: FiatCurrency.USD,
        quote: FiatCurrency.EUR,
      })

      const price2 = Price.createFrom({
        value: '108.54',
        base: FiatCurrency.USD,
        quote: FiatCurrency.EUR,
      })

      expect(price1.hasSameQuote(price2)).toBeTruthy()
    })

    it('should return false if the quotes are different', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: USDC,
      })

      expect(price.hasSameQuote(price2)).toBeFalsy()
    })
  })

  describe('#hasSameDenominations()', () => {
    it('should return true if the bases and quotes are the same', () => {
      const price1 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      expect(price1.hasSameDenominations(price2)).toBeTruthy()
    })

    it('should return false if the bases are different', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: FiatCurrency.USD,
      })

      const price2 = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: FiatCurrency.USD,
      })

      expect(price.hasSameDenominations(price2)).toBeFalsy()
    })

    it('should return false if the quotes are different', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: USDC,
      })

      expect(price.hasSameDenominations(price2)).toBeFalsy()
    })
  })

  describe('#add()', () => {
    it('should add the prices', () => {
      const price1 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '1.46',
        base: USDC,
        quote: DAI,
      })

      const result = price1.add(price2)

      expect(result.value).toEqual('110')
      if (!isToken(result.base)) {
        fail('Price base is not a token')
      }
      expect(result.base.equals(USDC)).toBeTruthy()
      if (!isToken(result.quote)) {
        fail('Price quote is not a token')
      }
      expect(result.quote.equals(DAI)).toBeTruthy()
    })

    it('should throw an error if the bases are different', () => {
      const price1 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '1.46',
        base: DAI,
        quote: DAI,
      })

      expect(() => price1.add(price2)).toThrow()
    })

    it('should throw an error if the quotes are different', () => {
      const price1 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '1.46',
        base: USDC,
        quote: USDC,
      })

      expect(() => price1.add(price2)).toThrow()
    })
  })

  describe('#subtract()', () => {
    it('should subtract the prices', () => {
      const price1 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '1.46',
        base: USDC,
        quote: DAI,
      })

      const result = price1.subtract(price2)

      expect(result.value).toEqual('107.08')
      if (!isToken(result.base)) {
        fail('Price base is not a token')
      }
      expect(result.base.equals(USDC)).toBeTruthy()
      if (!isToken(result.quote)) {
        fail('Price quote is not a token')
      }
      expect(result.quote.equals(DAI)).toBeTruthy()
    })

    it('should throw an error if the bases are different', () => {
      const price1 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '1.46',
        base: DAI,
        quote: DAI,
      })

      expect(() => price1.subtract(price2)).toThrow()
    })

    it('should throw an error if the quotes are different', () => {
      const price1 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '1.46',
        base: USDC,
        quote: USDC,
      })

      expect(() => price1.subtract(price2)).toThrow()
    })
  })

  describe('#multiply()', () => {
    it('should multiply the price by a number', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const result = price.multiply(2)

      expect(result.value).toEqual('217.08')
      if (!isToken(result.base)) {
        fail('Price base is not a token')
      }
      expect(result.base.equals(USDC)).toBeTruthy()
      if (!isToken(result.quote)) {
        fail('Price quote is not a token')
      }
      expect(result.quote.equals(DAI)).toBeTruthy()
    })

    it('should multiply the price by a string number', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const result = price.multiply('2')

      expect(result.value).toEqual('217.08')
      if (!isToken(result.base)) {
        fail('Price base is not a token')
      }
      expect(result.base.equals(USDC)).toBeTruthy()
      if (!isToken(result.quote)) {
        fail('Price quote is not a token')
      }
      expect(result.quote.equals(DAI)).toBeTruthy()
    })

    it('should multiply the price by a price with where first price quote is equal to second price base', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: FiatCurrency.EUR,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '2',
        base: DAI,
        quote: USDC,
      })

      const result = price.multiply(price2)

      expect(result.value).toEqual('217.08')
      if (!isFiatCurrency(result.base)) {
        fail('Price base is not a fiat currency')
      }
      expect(result.base).toEqual(FiatCurrency.EUR)
      if (!isToken(result.quote)) {
        fail('Price quote is not a token')
      }
      expect(result.quote.equals(USDC)).toBeTruthy()
    })

    it('should multiply the price by a price with where first price base is equal to second price quote', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: FiatCurrency.EUR,
      })

      const price2 = Price.createFrom({
        value: '2',
        base: USDC,
        quote: DAI,
      })

      const result = price.multiply(price2)

      expect(result.value).toEqual('217.08')
      if (!isToken(result.base)) {
        fail('Price base is not a token')
      }
      expect(result.base.equals(USDC)).toBeTruthy()
      if (!isFiatCurrency(result.quote)) {
        fail('Price quote is not a fiat currency')
      }
      expect(result.quote).toEqual(FiatCurrency.EUR)
    })

    it('should multiply the price by a token amount and return token amount', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: USDC,
      })

      const tokenAmount = TokenAmount.createFrom({
        token: DAI,
        amount: '2',
      })

      const result = price.multiply(tokenAmount)
      if (!isTokenAmount(result)) {
        fail('Result is not a token amount')
      }

      expect(result.amount).toEqual('217.08')
      expect(result.token.equals(USDC)).toBeTruthy()
    })

    it('should multiply the price by a fiat currency amount and return token amount', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: FiatCurrency.USD,
        quote: USDC,
      })

      const fiatAmount = FiatCurrencyAmount.createFrom({
        amount: '2',
        fiat: FiatCurrency.USD,
      })

      const result = price.multiply(fiatAmount)
      if (!isTokenAmount(result)) {
        fail('Result is not a token amount')
      }

      expect(result.amount).toEqual('217.08')
      expect(result.token.equals(USDC)).toBeTruthy()
    })

    it('should multiply the price by a token amount and return a fiat currency amount', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: FiatCurrency.USD,
      })

      const tokenAmount = TokenAmount.createFrom({
        token: DAI,
        amount: '2',
      })

      const result = price.multiply(tokenAmount)
      if (!isFiatCurrencyAmount(result)) {
        fail('Result is not a fiat currency amount')
      }

      expect(result.amount).toEqual('217.08')
      expect(result.fiat).toEqual(FiatCurrency.USD)
    })

    it('should multiply the price by a fiat currency amount and return a fiat currency amount', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: FiatCurrency.USD,
        quote: FiatCurrency.EUR,
      })

      const fiatAmount = FiatCurrencyAmount.createFrom({
        amount: '2',
        fiat: FiatCurrency.USD,
      })

      const result = price.multiply(fiatAmount)
      if (!isFiatCurrencyAmount(result)) {
        fail('Result is not a fiat currency amount')
      }

      expect(result.amount).toEqual('217.08')
      expect(result.fiat).toEqual(FiatCurrency.EUR)
    })

    it('should throw when multiplying by a token amount that is not the base, and the base is a token', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: USDC,
      })

      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '2',
      })

      expect(() => price.multiply(tokenAmount)).toThrow()
    })

    it('should throw when multiplying by a token amount that is not the base, and the base is a fiat currency', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: FiatCurrency.USD,
        quote: USDC,
      })

      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '2',
      })

      expect(() => price.multiply(tokenAmount)).toThrow()
    })

    it('should throw when multiplying by a fiat currency amount that is not the base, and the base is a fiat currency', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: FiatCurrency.EUR,
        quote: USDC,
      })

      const fiatAmount = FiatCurrencyAmount.createFrom({
        amount: '2',
        fiat: FiatCurrency.USD,
      })

      expect(() => price.multiply(fiatAmount)).toThrow()
    })

    it('should throw when multiplying by a fiat currency amount that is not the base, and the base is a token', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: USDC,
      })

      const fiatAmount = FiatCurrencyAmount.createFrom({
        amount: '2',
        fiat: FiatCurrency.USD,
      })

      expect(() => price.multiply(fiatAmount)).toThrow()
    })

    it('should throw when multiplying a price by a price and bases or quotes do not match', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: FiatCurrency.USD,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '108.54',
        base: FiatCurrency.EUR,
        quote: USDC,
      })

      expect(() => price.multiply(price2)).toThrow()
    })

    it('should throw when multiplying a price by a price and quote and base will both cancel out', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: USDC,
      })

      const price2 = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      expect(() => price.multiply(price2)).toThrow()
      expect(() => price2.multiply(price)).toThrow()
    })
  })

  describe('#divide()', () => {
    it('should divide the price by a number', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const result = price.divide(2)

      expect(result.value).toEqual('54.27')
      if (!isToken(result.base)) {
        fail('Price base is not a token')
      }
      expect(result.base.equals(USDC)).toBeTruthy()
      if (!isToken(result.quote)) {
        fail('Price quote is not a token')
      }
      expect(result.quote.equals(DAI)).toBeTruthy()
    })

    it('should divide the price by a string number', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const result = price.divide('2')

      expect(result.value).toEqual('54.27')
      if (!isToken(result.base)) {
        fail('Price base is not a token')
      }
      expect(result.base.equals(USDC)).toBeTruthy()
      if (!isToken(result.quote)) {
        fail('Price quote is not a token')
      }
      expect(result.quote.equals(DAI)).toBeTruthy()
    })

    it('should divide the price by a price with where first price quote is equal to second price quote', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const price2 = Price.createFrom({
        value: '2',
        base: FiatCurrency.EUR,
        quote: DAI,
      })

      const result = price.divide(price2)

      expect(result.value).toEqual('54.27')
      if (!isToken(result.base)) {
        fail('Price base is not a token')
      }
      expect(result.base.equals(USDC)).toBeTruthy()
      if (!isFiatCurrency(result.quote)) {
        fail('Price quote is not a fiat currency')
      }
      expect(result.quote).toEqual(FiatCurrency.EUR)
    })

    it('should divide the price by a price with where first price base is equal to second price base', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: USDC,
      })

      const price2 = Price.createFrom({
        value: '2',
        base: DAI,
        quote: FiatCurrency.EUR,
      })

      const result = price.divide(price2)

      expect(result.value).toEqual('54.27')
      if (!isFiatCurrency(result.base)) {
        fail('Price base is not a fiat currency')
      }
      expect(result.base).toEqual(FiatCurrency.EUR)
      if (!isToken(result.quote)) {
        fail('Price quote is not a token')
      }
      expect(result.quote.equals(USDC)).toBeTruthy()
    })

    it('should throw when dividing by a price with exact same base and quote', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: DAI,
        quote: USDC,
      })

      const price2 = Price.createFrom({
        value: '2',
        base: DAI,
        quote: USDC,
      })

      expect(() => price.divide(price2)).toThrow()
    })
  })

  describe('#invert()', () => {
    it('should invert the price', () => {
      const price = Price.createFrom({
        value: '100',
        base: USDC,
        quote: DAI,
      })

      const result = price.invert()

      expect(Number(result.value)).toBeCloseTo(0.01)
      if (!isToken(result.base)) {
        fail('Price base is not a token')
      }
      expect(result.base.equals(DAI)).toBeTruthy()
      if (!isToken(result.quote)) {
        fail('Price quote is not a token')
      }
      expect(result.quote.equals(USDC)).toBeTruthy()
    })
  })

  describe('#toBN()', () => {
    it('should convert the price to a big number', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const result = price.toBigNumber()

      expect(result.toString()).toEqual('108.54')
    })
  })

  describe('#toString()', () => {
    it('should convert the price to a string', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      expect(price.toString()).toEqual('108.54 DAI/USDC')
    })
  })

  describe('#isLessThan()', () => {
    it('should not accept a different base/quote', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '20.5',
        base: DAI,
        quote: FiatCurrency.USD,
      })

      expect(() => price.isLessThan(otherPrice)).toThrow()
    })

    it('should compare another price for less than', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '20.5',
        base: USDC,
        quote: DAI,
      })

      expect(otherPrice.isLessThan(price)).toBeTruthy()
      expect(price.isLessThan(otherPrice)).toBeFalsy()
    })
  })

  describe('#isLessThanOrEqual()', () => {
    it('should not accept a different base/quote', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '20.5',
        base: DAI,
        quote: FiatCurrency.USD,
      })

      expect(() => price.isLessThanOrEqual(otherPrice)).toThrow()
    })

    it('should compare another price for less than', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '20.5',
        base: USDC,
        quote: DAI,
      })

      expect(otherPrice.isLessThanOrEqual(price)).toBeTruthy()
      expect(price.isLessThanOrEqual(otherPrice)).toBeFalsy()
    })

    it('should compare another price for equality', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      expect(otherPrice.isLessThanOrEqual(price)).toBeTruthy()
      expect(price.isLessThanOrEqual(otherPrice)).toBeTruthy()
    })
  })

  describe('#isGreaterThan()', () => {
    it('should not accept a different base/quote', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '20.5',
        base: DAI,
        quote: FiatCurrency.USD,
      })

      expect(() => price.isGreaterThan(otherPrice)).toThrow()
    })

    it('should compare another price for greater than', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '20.5',
        base: USDC,
        quote: DAI,
      })

      expect(otherPrice.isGreaterThan(price)).toBeFalsy()
      expect(price.isGreaterThan(otherPrice)).toBeTruthy()
    })
  })

  describe('#isGreaterThanOrEqual()', () => {
    it('should not accept a different base/quote', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '20.5',
        base: DAI,
        quote: FiatCurrency.USD,
      })

      expect(() => price.isGreaterThanOrEqual(otherPrice)).toThrow()
    })

    it('should compare another price for greater than', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '20.5',
        base: USDC,
        quote: DAI,
      })

      expect(otherPrice.isGreaterThanOrEqual(price)).toBeFalsy()
      expect(price.isGreaterThanOrEqual(otherPrice)).toBeTruthy()
    })

    it('should compare another price for equality', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      expect(otherPrice.isGreaterThanOrEqual(price)).toBeTruthy()
      expect(price.isGreaterThanOrEqual(otherPrice)).toBeTruthy()
    })
  })

  describe('#isZero()', () => {
    it('should return true when price is 0', () => {
      const price = Price.createFrom({
        value: '0.000',
        base: USDC,
        quote: DAI,
      })

      expect(price.isZero()).toBeTruthy()
    })

    it('should return false when price is not 0', () => {
      const price = Price.createFrom({
        value: '0.1',
        base: USDC,
        quote: DAI,
      })

      expect(price.isZero()).toBeFalsy()
    })

    it('should return false when price is very small and close to 0', () => {
      const price = Price.createFrom({
        value: '0.0000000000000000001',
        base: USDC,
        quote: DAI,
      })

      expect(price.isZero()).toBeFalsy()
    })
  })

  describe('#isEqual()', () => {
    it('should not accept a different base/quote', () => {
      const price = Price.createFrom({
        value: '108.54',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '20.5',
        base: DAI,
        quote: FiatCurrency.USD,
      })

      expect(() => price.isEqual(otherPrice)).toThrow()
    })

    it('should return true when prices are equal', () => {
      const price = Price.createFrom({
        value: '123.45',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '123.45',
        base: USDC,
        quote: DAI,
      })

      expect(price.isEqual(otherPrice)).toBeTruthy()
    })

    it('should return false when prices are not equal', () => {
      const price = Price.createFrom({
        value: '123.45',
        base: USDC,
        quote: DAI,
      })

      const otherPrice = Price.createFrom({
        value: '123.46',
        base: USDC,
        quote: DAI,
      })

      expect(price.isEqual(otherPrice)).toBeFalsy()
    })
  })

  describe('#createFromAmountsRatio()', () => {
    it('should create a price from token amounts', () => {
      const daiAmount = TokenAmount.createFrom({
        token: DAI,
        amount: '100',
      })

      const usdcAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '10854',
      })

      const price = Price.createFromAmountsRatio({
        numerator: usdcAmount,
        denominator: daiAmount,
      })

      expect(price.value).toEqual('108.54')
      assert(isToken(price.base), 'Price base is not a token')
      expect(price.base.equals(DAI)).toBeTruthy()
      assert(isToken(price.quote), 'Price quote is not a token')
      expect(price.quote.equals(USDC)).toBeTruthy()
    })
  })
})
