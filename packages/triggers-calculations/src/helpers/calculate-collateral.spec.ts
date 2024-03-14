import { LTV, Price, PRICE_DECIMALS, Token, TokenBalance } from '@summerfi/triggers-shared'
import { calculateCollateral } from './calculate-collateral'

describe('calculate collateral', () => {
  it(`should return value of 1 ETH`, () => {
    const collateralToken: Token = {
      decimals: 18,
      symbol: 'WETH',
      address: '0x0',
    }
    const expectedResult: TokenBalance = {
      balance: 1n * 10n ** 18n,
      token: collateralToken,
    }

    const ltv: LTV = 2500n
    const debt: TokenBalance = {
      balance: 1_000n * 10n ** 6n,
      token: {
        decimals: 6,
        symbol: 'USDC',
        address: '0x1',
      },
    }
    const collateralPriceInDebt: Price = 4000n * 10n ** PRICE_DECIMALS

    const result = calculateCollateral({
      position: {
        ltv,
        debt,
        collateralPriceInDebt,
      },
      collateralToken,
    })

    expect(result).toEqual(expectedResult)
  })

  it('should return value of 0.5 ETH', () => {
    const collateralToken: Token = {
      decimals: 18,
      symbol: 'WETH',
      address: '0x0',
    }
    const expectedResult: TokenBalance = {
      balance: 5n * 10n ** (18n - 1n),
      token: collateralToken,
    }

    const ltv: LTV = 5000n
    const debt: TokenBalance = {
      balance: 1_000n * 10n ** 6n,
      token: {
        decimals: 6,
        symbol: 'USDC',
        address: '0x1',
      },
    }
    const collateralPriceInDebt: Price = 4000n * 10n ** PRICE_DECIMALS

    const result = calculateCollateral({
      position: {
        ltv,
        debt,
        collateralPriceInDebt,
      },
      collateralToken,
    })

    expect(result).toEqual(expectedResult)
  })
})
