import { getEmptyProfit } from './get-empty-profit'
import { MinimalAutoTakeProfitTriggerData, MinimalPositionLike } from './types'
import { PRICE_DECIMALS } from '~types'
import { CurrentStopLoss } from '../../trigger-encoders'
import { calculateNextProfit } from './calculate-next-profit'

const ETH_ASSERT_PRECISION = 10n ** 5n
/**
 * Test data is based on the spreadsheet.
 */
describe('Next profit calculation', () => {
  it('Should create a first profit with initial data', () => {
    const minimalPosition: MinimalPositionLike = {
      collateral: {
        balance: 1000n * 10n ** 18n,
        token: {
          address: '0x1',
          decimals: 18,
          symbol: 'WETH',
        },
      },
      debt: {
        balance: 1000000n * 10n ** 18n,
        token: {
          address: '0x2',
          decimals: 18,
          symbol: 'DAI',
        },
      },
      ltv: 5000n,
      collateralPriceInDebt: 2000n * 10n ** PRICE_DECIMALS,
    }
    const triggerData: MinimalAutoTakeProfitTriggerData = {
      executionLTV: 4000n,
      withdrawStep: 200n,
      executionPrice: 2500n * 10n ** PRICE_DECIMALS,
      withdrawToken: '0x1',
    }

    const currentStopLoss: CurrentStopLoss = {
      id: 10n,
      triggerData: '0x10',
      triggersOnAccount: 1,
      executionLTV: 6000n,
      executionPrice: 1666n * 10n ** PRICE_DECIMALS,
    }

    const nextProfit = calculateNextProfit({
      lastProfit: getEmptyProfit(minimalPosition),
      currentPosition: minimalPosition,
      triggerData,
      currentStopLoss,
    })

    const expectedCollateralProfit = 476190476190476n
    const expectedTriggerPrice = 2500n * 10n ** PRICE_DECIMALS
    const expectedStopLossPrice = 1750n * 10n ** PRICE_DECIMALS
    const collateralAfterExecution = 9523809523809523n
    const expectedLtv = 4200n

    expect(nextProfit.profit.realizedProfitInCollateral.balance / ETH_ASSERT_PRECISION).toBe(
      expectedCollateralProfit,
    )
    expect(nextProfit.profit.triggerPrice).toBe(expectedTriggerPrice)
    expect(nextProfit.profit.stopLossDynamicPrice).toBe(expectedStopLossPrice)
    expect(nextProfit.nextPosition.collateral.balance / ETH_ASSERT_PRECISION).toBe(
      collateralAfterExecution,
    )
    expect(nextProfit.nextPosition.debt.balance).toBe(minimalPosition.debt.balance)
    expect(nextProfit.nextPosition.ltv).toBe(expectedLtv)
  })
  it('Shuld create a next profit with data from previous profit', () => {
    const minimalPosition: MinimalPositionLike = {
      collateral: {
        balance: 1000n * 10n ** 18n,
        token: {
          address: '0x1',
          decimals: 18,
          symbol: 'WETH',
        },
      },
      debt: {
        balance: 1000000n * 10n ** 18n,
        token: {
          address: '0x2',
          decimals: 18,
          symbol: 'DAI',
        },
      },
      ltv: 5000n,
      collateralPriceInDebt: 2000n * 10n ** PRICE_DECIMALS,
    }
    const triggerData: MinimalAutoTakeProfitTriggerData = {
      executionLTV: 4000n,
      withdrawStep: 200n,
      executionPrice: 2500n * 10n ** PRICE_DECIMALS,
      withdrawToken: '0x1',
    }

    const currentStopLoss: CurrentStopLoss = {
      id: 10n,
      triggerData: '0x10',
      triggersOnAccount: 1,
      executionLTV: 6000n,
      executionPrice: 1666n * 10n ** PRICE_DECIMALS,
    }

    const initialProfit = calculateNextProfit({
      lastProfit: getEmptyProfit(minimalPosition),
      currentPosition: minimalPosition,
      triggerData,
      currentStopLoss,
    })

    const nextProfit = calculateNextProfit({
      lastProfit: initialProfit.profit,
      currentPosition: initialProfit.nextPosition,
      triggerData,
      currentStopLoss,
    })

    const expectedCollateralProfit = 453514739229024n
    const expectedTriggerPrice = 2625n * 10n ** PRICE_DECIMALS
    const expectedStopLossPrice = 18375n * 10n ** (PRICE_DECIMALS - 1n)
    const collateralAfterExecution = 9070294784580498n
    const expectedLtv = 4200n

    expect(nextProfit.profit.realizedProfitInCollateral.balance / ETH_ASSERT_PRECISION).toBe(
      expectedCollateralProfit,
    )
    expect(nextProfit.profit.triggerPrice).toBe(expectedTriggerPrice)
    expect(nextProfit.profit.stopLossDynamicPrice).toBe(expectedStopLossPrice)
    expect(nextProfit.nextPosition.collateral.balance / ETH_ASSERT_PRECISION).toBe(
      collateralAfterExecution,
    )
    expect(nextProfit.nextPosition.debt.balance).toBe(minimalPosition.debt.balance)
    expect(nextProfit.nextPosition.ltv).toBe(expectedLtv)
  })
})
