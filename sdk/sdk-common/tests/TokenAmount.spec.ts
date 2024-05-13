import {
  Address,
  ChainInfo,
  FiatCurrency,
  IToken,
  Percentage,
  Price,
  TokenAmount,
  isFiatCurrencyAmount,
  isTokenAmount,
} from '../src'
import { Token } from '../src/common/implementation/Token'

describe('SDK Common | TokenAmount', () => {
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
    it('should instantiate with right data', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      expect(tokenAmount.token.equals(USDC)).toBeTruthy()
      expect(tokenAmount.amount).toEqual('108.54')
    })
  })
  describe('#createFromBaseUnit()', () => {
    it('should instantiate with right data', () => {
      const tokenAmount = TokenAmount.createFromBaseUnit({
        token: USDC,
        amount: '108540000',
      })

      expect(tokenAmount.token.equals(USDC)).toBeTruthy()
      expect(tokenAmount.amount).toEqual('108.54')
    })
  })

  describe('#add()', () => {
    it('should add the amounts', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const tokenAmount2 = TokenAmount.createFrom({
        token: USDC,
        amount: '1.46',
      })

      const result = tokenAmount.add(tokenAmount2)

      expect(result.token.equals(USDC)).toBeTruthy()
      expect(result.amount).toEqual('110')
    })

    it('should throw an error if tokens are different', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const tokenAmount2 = TokenAmount.createFrom({
        token: DAI,
        amount: '1.46',
      })

      expect(() => tokenAmount.add(tokenAmount2)).toThrow()
    })
  })

  describe('#subtract()', () => {
    it('should subtract the amounts', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const tokenAmount2 = TokenAmount.createFrom({
        token: USDC,
        amount: '1.46',
      })

      const result = tokenAmount.subtract(tokenAmount2)

      expect(result.token.equals(USDC)).toBeTruthy()
      expect(result.amount).toEqual('107.08')
    })

    it('should throw an error if tokens are different', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const tokenAmount2 = TokenAmount.createFrom({
        token: DAI,
        amount: '1.46',
      })

      expect(() => tokenAmount.subtract(tokenAmount2)).toThrow()
    })
  })

  describe('#multiply()', () => {
    it('should multiply the amount by a number', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const result = tokenAmount.multiply(2)

      expect(result.token.equals(USDC)).toBeTruthy()
      expect(result.amount).toEqual('217.08')
    })

    it('should multiply the amount by a percentage', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const percentage = Percentage.createFrom({ value: 50.0 })
      const result = tokenAmount.multiply(percentage)

      expect(result.token.equals(USDC)).toBeTruthy()
      expect(result.amount).toEqual('54.27')
    })

    it('should multiply the amount by a string number', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const result = tokenAmount.multiply('2')

      expect(result.token.equals(USDC)).toBeTruthy()
      expect(result.amount).toEqual('217.08')
    })

    it('should multiply the amount by a price and result in a token amount', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const price = Price.createFrom({
        value: '1.08',
        base: USDC,
        quote: DAI,
      })

      const result = tokenAmount.multiply(price)
      if (!isTokenAmount(result)) {
        throw new Error('Expected a TokenAmount')
      }

      expect(result.token.equals(DAI)).toBeTruthy()
      expect(result.amount).toEqual('117.2232')
    })

    it('should multiply the amount by a price and result in a fiat currency amount', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const price = Price.createFrom({
        value: '1.08',
        base: USDC,
        quote: FiatCurrency.EUR,
      })

      const result = tokenAmount.multiply(price)
      if (!isFiatCurrencyAmount(result)) {
        throw new Error('Expected a FiatCurrencyAmount')
      }

      expect(result.fiat).toEqual(FiatCurrency.EUR)
      expect(result.amount).toEqual('117.2232')
    })
  })

  describe('#divide()', () => {
    it('should divide the amount by a number', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const result = tokenAmount.divide(2)

      expect(result.token.equals(USDC)).toBeTruthy()
      expect(result.amount).toEqual('54.27')
    })

    it('should divide the amount by a percentage', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const percentage = Percentage.createFrom({ value: 50.0 })
      const result = tokenAmount.divide(percentage)

      expect(result.token.equals(USDC)).toBeTruthy()
      expect(result.amount).toEqual('217.08')
    })

    it('should divide the amount by a string number', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const result = tokenAmount.divide('2')

      expect(result.token.equals(USDC)).toBeTruthy()
      expect(result.amount).toEqual('54.27')
    })

    it('should divide the amount by a price and result in a token amount', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: DAI,
        amount: '108.54',
      })

      const price = Price.createFrom({
        value: '1.08',
        base: USDC,
        quote: DAI,
      })

      const result = tokenAmount.divide(price)
      if (!isTokenAmount(result)) {
        throw new Error('Expected a TokenAmount')
      }

      expect(result.token.equals(USDC)).toBeTruthy()
      expect(Number(result.amount)).toBeCloseTo(100.5)
    })

    it('should divide the amount by a price and result in a fiat currency amount', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      const price = Price.createFrom({
        value: '1.08',
        base: FiatCurrency.EUR,
        quote: USDC,
      })

      const result = tokenAmount.divide(price)
      if (!isFiatCurrencyAmount(result)) {
        throw new Error('Expected a FiatCurrencyAmount')
      }

      expect(result.fiat).toEqual(FiatCurrency.EUR)
      expect(Number(result.amount)).toBeCloseTo(100.5)
    })
  })

  describe('#toString()', () => {
    it('should return the string representation', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      expect(tokenAmount.toString()).toEqual('108.54 USDC')
    })
  })

  describe('#toBN()', () => {
    it('should return the amount as a BigNumber', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      expect(tokenAmount.toBN().toString()).toEqual('108.54')
    })
  })

  describe('#toBaseUnit()', () => {
    it('should return the amount in base unit', () => {
      const tokenAmount = TokenAmount.createFrom({
        token: USDC,
        amount: '108.54',
      })

      expect(tokenAmount.toBaseUnit()).toEqual('108540000')
    })
  })
})
