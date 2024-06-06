import { Percentage, TokenAmount, type Position } from '@summerfi/sdk-common/common'

import { PositionUtils } from '../src/utils/PositionUtils'
import { WETH, DAI } from './TestUtils'

describe('PositionUtils', () => {
  const ethPriceInCollateral = '1000'
  const daiPriceInCollateral = '1'

  describe('getLTV', () => {
    it('should correctly calculate LTV', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '1', token: WETH })
      const debtAmount = TokenAmount.createFrom({ amount: '250', token: DAI })

      const result = PositionUtils.getLTV({
        collateralTokenAmount: collateralAmount,
        debtTokenAmount: debtAmount,
        collateralPriceInUsd: ethPriceInCollateral,
        debtPriceInUsd: daiPriceInCollateral,
      })

      expect(result).toEqual(Percentage.createFrom({ value: 25 }))
    })

    it('should return 0 when debt is equal to 0', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '1', token: WETH })
      const debtAmount = TokenAmount.createFrom({ amount: '0', token: DAI })

      const result = PositionUtils.getLTV({
        collateralTokenAmount: collateralAmount,
        debtTokenAmount: debtAmount,
        collateralPriceInUsd: ethPriceInCollateral,
        debtPriceInUsd: daiPriceInCollateral,
      })

      expect(result).toEqual(Percentage.createFrom({ value: 0 }))
    })

    it('should return 0 when collateral amount is 0', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '0', token: WETH })
      const debtAmount = TokenAmount.createFrom({ amount: '1000', token: DAI })

      const result = PositionUtils.getLTV({
        collateralTokenAmount: collateralAmount,
        debtTokenAmount: debtAmount,
        collateralPriceInUsd: ethPriceInCollateral,
        debtPriceInUsd: daiPriceInCollateral,
      })

      expect(result).toEqual(Percentage.createFrom({ value: 0 }))
    })

    it('should return 100 when debt is equal to collateral', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '1', token: WETH })
      const debtAmount = TokenAmount.createFrom({ amount: '1000', token: DAI })

      const result = PositionUtils.getLTV({
        collateralTokenAmount: collateralAmount,
        debtTokenAmount: debtAmount,
        collateralPriceInUsd: ethPriceInCollateral,
        debtPriceInUsd: daiPriceInCollateral,
      })

      expect(result).toEqual(Percentage.createFrom({ value: 100 }))
    })
  })

  describe('getLiquidationPrice', () => {
    it('should correctly calculate liquidation price for long position', () => {
      const liquidationThreshold = Percentage.createFrom({ value: 80 })

      const liquidationPrice = PositionUtils.calculateLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '1500', token: DAI }),
        } as Position,
        liquidationThreshold,
        debtPriceInCollateral: daiPriceInCollateral,
      })
      expect(liquidationPrice).toEqual('937.5')

      const liquidationPrice2 = PositionUtils.calculateLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '1600', token: DAI }),
        } as Position,
        liquidationThreshold,
        debtPriceInCollateral: daiPriceInCollateral,
      })
      expect(liquidationPrice2).toEqual('1000')

      const liquidationPrice3 = PositionUtils.calculateLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '1', token: DAI }),
        } as Position,
        liquidationThreshold,
        debtPriceInCollateral: daiPriceInCollateral,
      })
      expect(liquidationPrice3).toEqual('0.625')
    })

    it('should correctly calculate liquidation price for short position', () => {
      const liquidationThreshold = Percentage.createFrom({ value: 80 })

      const liquidationPrice = PositionUtils.calculateLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2000', token: DAI }),
          debtAmount: TokenAmount.createFrom({ amount: '1.5', token: WETH }),
        } as Position,
        liquidationThreshold,
        debtPriceInCollateral: ethPriceInCollateral,
      })
      expect(liquidationPrice).toEqual('937.5')

      const liquidationPrice2 = PositionUtils.calculateLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2000', token: DAI }),
          debtAmount: TokenAmount.createFrom({ amount: '1.6', token: WETH }),
        } as Position,
        liquidationThreshold,
        debtPriceInCollateral: ethPriceInCollateral,
      })
      expect(liquidationPrice2).toEqual('1000')

      const liquidationPrice3 = PositionUtils.calculateLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2000', token: DAI }),
          debtAmount: TokenAmount.createFrom({ amount: '0.001', token: WETH }),
        } as Position,
        liquidationThreshold,
        debtPriceInCollateral: ethPriceInCollateral,
      })
      expect(liquidationPrice3).toEqual('0.625')
    })

    it('should return 0 when debt amount is 0', () => {
      const liquidationThreshold = Percentage.createFrom({ value: 80 })

      const liquidationPrice = PositionUtils.calculateLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '100', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '0', token: DAI }),
        } as Position,
        liquidationThreshold,
        debtPriceInCollateral: daiPriceInCollateral,
      })

      expect(liquidationPrice).toEqual('0')
    })
  })
})
