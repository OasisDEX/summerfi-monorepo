import { Price, PRICE_DECIMALS, Token, TokenBalance } from '~types'
import { calculateBalance } from './calculate-balance'
import { reversePrice } from './reverse-price'

describe('Calculate Balance', () => {
  it(`Should return balance in USDC when ETH passed with price`, () => {
    const from: TokenBalance = {
      balance: 2n * 10n ** 18n,
      token: {
        decimals: 18,
        symbol: 'WETH',
        address: '0x0',
      },
    }

    const to: Token = {
      decimals: 6,
      symbol: 'USDC',
      address: '0x1',
    }

    const price: Price = 2000n * 10n ** PRICE_DECIMALS // ETH/USDC

    const expectedResult: TokenBalance = {
      balance: 4000n * 10n ** 6n,
      token: to,
    }

    const result = calculateBalance(from, to, price)

    expect(result).toEqual(expectedResult)
  })
  it('Should return balance in ETH when USDC passed with price', () => {
    const from: TokenBalance = {
      balance: 4000n * 10n ** 6n,
      token: {
        decimals: 6,
        symbol: 'USDC',
        address: '0x1',
      },
    }

    const to: Token = {
      decimals: 18,
      symbol: 'WETH',
      address: '0x0',
    }

    const price: Price = reversePrice(2000n * 10n ** PRICE_DECIMALS)

    const expectedResult: TokenBalance = {
      balance: 2n * 10n ** 18n,
      token: to,
    }

    const result = calculateBalance(from, to, price)

    expect(result).toEqual(expectedResult)
  })
})
