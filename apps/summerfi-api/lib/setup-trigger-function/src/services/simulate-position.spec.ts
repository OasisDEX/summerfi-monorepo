import { simulatePosition, SimulatePositionParams } from './simulate-position'
import { Logger } from '@aws-lambda-powertools/logger'
import { PRICE_DECIMALS } from '~types'

const logger = new Logger({
  serviceName: 'simulate-position-tests',
  environment: 'dev',
  logLevel: 'debug',
})

describe('simulatePosition', () => {
  it('should return consistent values', () => {
    const params: SimulatePositionParams = {
      position: {
        netValueUSD: 0n,
        collateralValueUSD: 0n,
        debtValueUSD: 0n,
        hasStablecoinDebt: true,
        collateral: {
          balance: 10n * 10n ** 18n,
          token: {
            decimals: 18,
            symbol: 'WETH',
            address: '0x0',
          },
        },
        debt: {
          balance: 14000n * 10n ** 6n,
          token: {
            decimals: 6,
            symbol: 'USDC',
            address: '0x1',
          },
        },
        ltv: 5_000n,
        oraclePrices: {
          collateralPrice: 1n * 10n ** PRICE_DECIMALS,
          debtPrice: 1n * 10n ** PRICE_DECIMALS,
        },
        address: '0x2',
        collateralPriceInDebt: 2800n * 10n ** PRICE_DECIMALS,
      },
      targetLTV: 7_500n,
      executionLTV: 5_000n,
      executionPrice: 2800n * 10n ** PRICE_DECIMALS,
    }

    const result = simulatePosition(params, logger)

    expect(result.collateralAmountAfterExecution).toBeGreaterThan(
      params.position.collateral.balance,
    )
  })
})
