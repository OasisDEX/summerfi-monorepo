import { Percentage, TokenBalance } from '~types'
import { subtractPercentage } from './subtract-percentage'

describe('subtract slippage', () => {
  it(`Should return a value of 0.998 ETH when slippage is 0.2% and balance is 1 ETH.`, () => {
    const tokenBalance: TokenBalance = {
      balance: 1n * 10n ** 18n,
      token: {
        decimals: 18,
        symbol: 'WETH',
        address: '0x0',
      },
    }

    const expectedResult: TokenBalance = {
      balance: (998n * 10n ** 18n) / 10n ** 3n,
      token: tokenBalance.token,
    }

    const slippage: Percentage = 20n

    const result = subtractPercentage(tokenBalance, slippage)

    expect(result).toEqual(expectedResult)
  })
})
