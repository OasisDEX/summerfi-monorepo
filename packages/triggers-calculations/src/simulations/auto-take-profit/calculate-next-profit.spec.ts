import { getEmptyProfit } from './get-empty-profit'
import { MinimalAutoTakeProfitTriggerData, MinimalPositionLike } from './types'
import { PRICE_DECIMALS } from '@summerfi/triggers-shared'
import { calculateNextProfit } from './calculate-next-profit'

const assertBigintToBeCloseTo = (received: bigint, expected: bigint, precision: bigint) => {
  const abs = (a: bigint) => (a < 0n ? -a : a)
  expect(
    abs(received - expected),
    `expected ${received} to be close to ${expected} with precision ${precision}`,
  ).toBeLessThan(10n ** precision)
}

/**
 * Test data is based on the spreadsheet.
 */
describe('Next profit calculation', () => {
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

  const currentStopLoss = {
    id: 10n,
    triggerData: '0x10',
    triggersOnAccount: 1,
    executionLTV: 6000n,
    executionPrice: 1666n * 10n ** PRICE_DECIMALS,
  }
  it('Should create a first profit with initial data', () => {
    const nextProfit = calculateNextProfit({
      lastProfit: getEmptyProfit(minimalPosition),
      currentPosition: minimalPosition,
      triggerData,
      currentStopLoss,
    })

    const expectedCollateralProfit = 47619047619047700000n
    const expectedTriggerPrice = 2500n * 10n ** PRICE_DECIMALS
    const expectedStopLossPrice = 1750n * 10n ** PRICE_DECIMALS
    const collateralAfterExecution = 952380952380952000000n
    const expectedLtv = 4200n

    assertBigintToBeCloseTo(
      nextProfit.profit.realizedProfitInCollateral.balance,
      expectedCollateralProfit,
      5n,
    )
    expect(nextProfit.profit.triggerPrice).toBe(expectedTriggerPrice)
    expect(nextProfit.profit.stopLossDynamicPrice).toBe(expectedStopLossPrice)
    assertBigintToBeCloseTo(
      nextProfit.nextPosition.collateral.balance,
      collateralAfterExecution,
      6n,
    )
    expect(nextProfit.nextPosition.debt.balance).toBe(minimalPosition.debt.balance)
    expect(nextProfit.nextPosition.ltv).toBe(expectedLtv)
  })
  it('Should create a next profit with data from previous profit', () => {
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

    const expectedCollateralProfit = 45351473922902400000n
    const expectedTriggerPrice = 2625n * 10n ** PRICE_DECIMALS
    const expectedStopLossPrice = 18375n * 10n ** (PRICE_DECIMALS - 1n)
    const collateralAfterExecution = 907029478458050000000n
    const expectedLtv = 4200n

    assertBigintToBeCloseTo(
      nextProfit.profit.realizedProfitInCollateral.balance,
      expectedCollateralProfit,
      5n,
    )
    expect(nextProfit.profit.triggerPrice).toBe(expectedTriggerPrice)
    expect(nextProfit.profit.stopLossDynamicPrice).toBe(expectedStopLossPrice)
    assertBigintToBeCloseTo(
      nextProfit.nextPosition.collateral.balance,
      collateralAfterExecution,
      6n,
    )
    expect(nextProfit.nextPosition.debt.balance).toBe(minimalPosition.debt.balance)
    expect(nextProfit.nextPosition.ltv).toBe(expectedLtv)
  })

  it('Should create a third profit with data from previous profit', () => {
    const firstProfit = calculateNextProfit({
      lastProfit: getEmptyProfit(minimalPosition),
      currentPosition: minimalPosition,
      triggerData,
      currentStopLoss,
    })

    const secondProfit = calculateNextProfit({
      lastProfit: firstProfit.profit,
      currentPosition: firstProfit.nextPosition,
      triggerData,
      currentStopLoss,
    })

    const thirdProfit = calculateNextProfit({
      lastProfit: secondProfit.profit,
      currentPosition: secondProfit.nextPosition,
      triggerData,
      currentStopLoss,
    })

    const expectedCollateralProfit = 43191879926573900000n
    const expectedTriggerPrice = 275625n * 10n ** (PRICE_DECIMALS - 2n)
    const expectedStopLossPrice = 1929375n * 10n ** (PRICE_DECIMALS - 3n)
    const collateralAfterExecution = 863837598531476000000n
    const expectedLtv = 4200n

    assertBigintToBeCloseTo(
      thirdProfit.profit.realizedProfitInCollateral.balance,
      expectedCollateralProfit,
      5n,
    )
    expect(thirdProfit.profit.triggerPrice).toBe(expectedTriggerPrice)
    expect(thirdProfit.profit.stopLossDynamicPrice).toBe(expectedStopLossPrice)
    assertBigintToBeCloseTo(
      thirdProfit.nextPosition.collateral.balance,
      collateralAfterExecution,
      6n,
    )
    expect(thirdProfit.nextPosition.debt.balance).toBe(minimalPosition.debt.balance)
    expect(thirdProfit.nextPosition.ltv).toBe(expectedLtv)
  })
})
