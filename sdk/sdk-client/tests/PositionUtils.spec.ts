import { Percentage, TokenAmount } from '@summerfi/sdk-common'

import { LendingPosition } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'
import { PositionUtils } from '../src/utils/PositionUtils'
import { DAI, WETH, WSTETH } from './TestUtils'

describe('PositionUtils', () => {
  const daiPriceInUsd = '1'
  const ethPriceInUsd = '1000'
  const wstethPriceInUsd = '2000'

  describe('getLTV', () => {
    it('should correctly calculate LTV', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '1', token: WETH })
      const debtAmount = TokenAmount.createFrom({ amount: '250', token: DAI })

      const result = PositionUtils.getLTV({
        collateralTokenAmount: collateralAmount,
        debtTokenAmount: debtAmount,
        collateralPriceInUsd: ethPriceInUsd,
        debtPriceInUsd: daiPriceInUsd,
      })

      expect(result).toEqual(Percentage.createFrom({ value: 25 }))
    })

    it('should return 0 when debt is equal to 0', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '1', token: WETH })
      const debtAmount = TokenAmount.createFrom({ amount: '0', token: DAI })

      const result = PositionUtils.getLTV({
        collateralTokenAmount: collateralAmount,
        debtTokenAmount: debtAmount,
        collateralPriceInUsd: ethPriceInUsd,
        debtPriceInUsd: daiPriceInUsd,
      })

      expect(result).toEqual(Percentage.createFrom({ value: 0 }))
    })

    it('should return 0 when collateral amount is 0', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '0', token: WETH })
      const debtAmount = TokenAmount.createFrom({ amount: '1000', token: DAI })

      const result = PositionUtils.getLTV({
        collateralTokenAmount: collateralAmount,
        debtTokenAmount: debtAmount,
        collateralPriceInUsd: ethPriceInUsd,
        debtPriceInUsd: daiPriceInUsd,
      })

      expect(result).toEqual(Percentage.createFrom({ value: 0 }))
    })

    it('should return 100 when debt is equal to collateral', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '1', token: WETH })
      const debtAmount = TokenAmount.createFrom({ amount: '1000', token: DAI })

      const result = PositionUtils.getLTV({
        collateralTokenAmount: collateralAmount,
        debtTokenAmount: debtAmount,
        collateralPriceInUsd: ethPriceInUsd,
        debtPriceInUsd: daiPriceInUsd,
      })

      expect(result).toEqual(Percentage.createFrom({ value: 100 }))
    })
  })

  describe('getLiquidationPrice', () => {
    it('should correctly calculate liquidation price for long position', () => {
      const liquidationThreshold = Percentage.createFrom({ value: 80 })

      const liquidationPrice = PositionUtils.getLiquidationPriceInDebtTokens({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '1500', token: DAI }),
        } as LendingPosition,
        liquidationThreshold,
        debtPriceInUsd: daiPriceInUsd,
      })
      expect(liquidationPrice).toEqual('937.5')

      const liquidationPrice2 = PositionUtils.getLiquidationPriceInDebtTokens({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '1600', token: DAI }),
        } as LendingPosition,
        liquidationThreshold,
        debtPriceInUsd: daiPriceInUsd,
      })
      expect(liquidationPrice2).toEqual('1000')

      const liquidationPrice3 = PositionUtils.getLiquidationPriceInDebtTokens({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '1', token: DAI }),
        } as LendingPosition,
        liquidationThreshold,
        debtPriceInUsd: daiPriceInUsd,
      })
      expect(liquidationPrice3).toEqual('0.625')

      const liquidationPrice4 = PositionUtils.getLiquidationPriceInDebtTokens({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '4', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '1.6', token: WSTETH }),
        } as LendingPosition,
        liquidationThreshold,
        debtPriceInUsd: daiPriceInUsd,
      })
      expect(liquidationPrice4).toEqual(
        new BigNumber(ethPriceInUsd).div(wstethPriceInUsd).toString(),
      )
    })

    it('should correctly calculate liquidation price for short position', () => {
      const liquidationThreshold = Percentage.createFrom({ value: 80 })

      const liquidationPrice = PositionUtils.getLiquidationPriceInDebtTokens({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2000', token: DAI }),
          debtAmount: TokenAmount.createFrom({ amount: '1.5', token: WETH }),
        } as LendingPosition,
        liquidationThreshold,
        debtPriceInUsd: ethPriceInUsd,
      })
      expect(liquidationPrice).toEqual('0.0009375')

      const liquidationPrice2 = PositionUtils.getLiquidationPriceInDebtTokens({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2000', token: DAI }),
          debtAmount: TokenAmount.createFrom({ amount: '1.6', token: WETH }),
        } as LendingPosition,
        liquidationThreshold,
        debtPriceInUsd: ethPriceInUsd,
      })
      expect(liquidationPrice2).toEqual('0.001')

      const liquidationPrice3 = PositionUtils.getLiquidationPriceInDebtTokens({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2000', token: DAI }),
          debtAmount: TokenAmount.createFrom({ amount: '0.001', token: WETH }),
        } as LendingPosition,
        liquidationThreshold,
        debtPriceInUsd: ethPriceInUsd,
      })
      expect(liquidationPrice3).toEqual('6.25e-7')

      const liquidationPrice4 = PositionUtils.getLiquidationPriceInDebtTokens({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WSTETH }),
          debtAmount: TokenAmount.createFrom({ amount: '3.2', token: WETH }),
        } as LendingPosition,
        liquidationThreshold,
        debtPriceInUsd: ethPriceInUsd,
      })
      expect(liquidationPrice4).toEqual(
        new BigNumber(wstethPriceInUsd).div(ethPriceInUsd).toString(),
      )
    })

    it('should return 0 when debt amount is 0', () => {
      const liquidationThreshold = Percentage.createFrom({ value: 80 })

      const liquidationPrice = PositionUtils.getLiquidationPriceInDebtTokens({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '100', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '0', token: DAI }),
        } as LendingPosition,
        liquidationThreshold,
        debtPriceInUsd: daiPriceInUsd,
      })

      expect(liquidationPrice).toEqual('0')
    })
  })
})
