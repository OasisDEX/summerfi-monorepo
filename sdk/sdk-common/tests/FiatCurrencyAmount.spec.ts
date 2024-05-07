import {
  Address,
  ChainInfo,
  FiatCurrency,
  FiatCurrencyAmount,
  IToken,
  Percentage,
  Price,
  Token,
  isFiatCurrencyAmount,
  isTokenAmount,
} from '../src'

describe('SDK Common | FiatCurrencyAmount', () => {
  let USDC: IToken

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
  })
  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '108.54',
      })

      expect(fiatAmount.fiat).toEqual(FiatCurrency.USD)
      expect(fiatAmount.amount).toEqual('108.54')
    })
  })

  describe('#add()', () => {
    it('should add the amounts', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '108.54',
      })

      const fiatAmount2 = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '100.46',
      })

      const result = fiatAmount.add(fiatAmount2)

      expect(result.amount).toEqual('209')
    })

    it('should throw an error if fiats are different', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '108.54',
      })

      const fiatAmount2 = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.EUR,
        amount: '1.46',
      })

      expect(() => fiatAmount.add(fiatAmount2)).toThrow()
    })
  })

  describe('#subtract()', () => {
    it('should subtract the amounts', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '108.54',
      })

      const fiatAmount2 = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '1.46',
      })

      const result = fiatAmount.subtract(fiatAmount2)

      expect(Number(result.amount)).toBeCloseTo(107.08)
    })

    it('should throw an error if fiats are different', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '108.54',
      })

      const fiatAmount2 = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.EUR,
        amount: '1.46',
      })

      expect(() => fiatAmount.subtract(fiatAmount2)).toThrow()
    })
  })

  describe('#multiply()', () => {
    it('should multiply the amount by a number', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      const result = fiatAmount.multiply(50)

      expect(result.amount).toEqual('500')
    })

    it('should multiply the amount by a string number', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      const result = fiatAmount.multiply('50')

      expect(result.amount).toEqual('500')
    })

    it('should multiply the amount by a percentage', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      const percentage = Percentage.createFrom({
        value: 50,
      })

      const result = fiatAmount.multiply(percentage)

      expect(result.amount).toEqual('5')
    })

    it('should multiply the amount by a price and return a fiat amount', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      const price = Price.createFrom({
        value: '5',
        base: FiatCurrency.USD,
        quote: FiatCurrency.EUR,
      })

      const result = fiatAmount.multiply(price)
      if (!isFiatCurrencyAmount(result)) {
        throw new Error('Expected a FiatCurrencyAmount')
      }

      expect(result.amount).toEqual('50')
      expect(result.fiat).toEqual(FiatCurrency.EUR)
    })

    it('should multiply the amount by a price and return a token amount', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      const price = Price.createFrom({
        value: '5',
        base: FiatCurrency.USD,
        quote: USDC,
      })

      const result = fiatAmount.multiply(price)
      if (!isTokenAmount(result)) {
        throw new Error('Expected a TokenAmount')
      }

      expect(result.amount).toEqual('50')
      expect(result.token.equals(USDC)).toBeTruthy()
    })
  })

  describe('#divide()', () => {
    it('should divide the amount by a number', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      const result = fiatAmount.divide(2)

      expect(result.amount).toEqual('5')
    })

    it('should divide the amount by a string number', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      const result = fiatAmount.divide('2')

      expect(result.amount).toEqual('5')
    })

    it('should divide the amount by a percentage', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      const percentage = Percentage.createFrom({
        value: 50,
      })

      const result = fiatAmount.divide(percentage)

      expect(result.amount).toEqual('20')
    })

    it('should divide the amount by a price and return a fiat amount', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      const price = Price.createFrom({
        value: '5',
        base: FiatCurrency.EUR,
        quote: FiatCurrency.USD,
      })

      const result = fiatAmount.divide(price)
      if (!isFiatCurrencyAmount(result)) {
        throw new Error('Expected a FiatCurrencyAmount')
      }

      expect(result.amount).toEqual('2')
      expect(result.fiat).toEqual(FiatCurrency.EUR)
    })

    it('should divide the amount by a price and return a token amount', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      const price = Price.createFrom({
        value: '5',
        base: USDC,
        quote: FiatCurrency.USD,
      })

      const result = fiatAmount.divide(price)
      if (!isTokenAmount(result)) {
        throw new Error('Expected a TokenAmount')
      }

      expect(result.amount).toEqual('2')
      expect(result.token.equals(USDC)).toBeTruthy()
    })
  })

  describe('#toString()', () => {
    it('should return the string representation', () => {
      const fiatAmount = FiatCurrencyAmount.createFrom({
        fiat: FiatCurrency.USD,
        amount: '10',
      })

      expect(fiatAmount.toString()).toEqual('10 USD')
    })
  })
})
