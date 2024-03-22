import { Percentage, TokenAmount, type Position } from '@summerfi/sdk-common/common'

import { PositionUtils } from '../src/utils/PositionUtils'
import { WETH, DAI } from './TestUtils'

describe.only('PositionUtils', () => {
  describe('getLTV', () => {
    it('should correctly calculate LTV', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '1', token: WETH })
      const collateralPrice = '1000'
      const debtAmount = TokenAmount.createFrom({ amount: '250', token: DAI })
      const debtPrice = '1'

      const result = PositionUtils.getLTV({
        collateralAmount,
        debtAmount,
        collateralPrice,
        debtPrice,
      })

      expect(result).toEqual(Percentage.createFrom({ percentage: 25 }))
    })

    it('should return 0 when debt is equal to 0', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '1', token: WETH })
      const collateralPrice = '1000'
      const debtAmount = TokenAmount.createFrom({ amount: '0', token: DAI })
      const debtPrice = '1'

      const result = PositionUtils.getLTV({
        collateralAmount,
        debtAmount,
        collateralPrice,
        debtPrice,
      })

      expect(result).toEqual(Percentage.createFrom({ percentage: 0 }))
    })

    it('should return 0 when collateral amount is 0', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '0', token: WETH })
      const collateralPrice = '1000'
      const debtAmount = TokenAmount.createFrom({ amount: '1000', token: DAI })
      const debtPrice = '1'

      const result = PositionUtils.getLTV({
        collateralAmount,
        debtAmount,
        collateralPrice,
        debtPrice,
      })

      expect(result).toEqual(Percentage.createFrom({ percentage: 0 }))
    })

    it('should return 100 when debt is equal to collateral', () => {
      const collateralAmount = TokenAmount.createFrom({ amount: '1', token: WETH })
      const collateralPrice = '1000'
      const debtAmount = TokenAmount.createFrom({ amount: '1000', token: DAI })
      const debtPrice = '1'

      const result = PositionUtils.getLTV({
        collateralAmount,
        debtAmount,
        collateralPrice,
        debtPrice,
      })

      expect(result).toEqual(Percentage.createFrom({ percentage: 100 }))
    })
  })

  describe('getLiquidationPrice', () => {
    it('should correctly calculate liquidation price when debt amount is not 0', () => {
      const liquidationThreshold = Percentage.createFrom({ percentage: 80 })
      const collateralPrice = '3000'
      const debtPrice = '1'

      const liquidationPrice = PositionUtils.getLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '5000', token: DAI }),
        } as Position,
        liquidationThreshold,
        collateralPrice,
        debtPrice,
      })
      expect(liquidationPrice).toEqual('3125')

      const liquidationPrice2 = PositionUtils.getLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '6000', token: DAI }),
        } as Position,
        liquidationThreshold,
        collateralPrice,
        debtPrice,
      })
      expect(liquidationPrice2).toEqual('3750')

      const liquidationPrice3 = PositionUtils.getLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '1', token: DAI }),
        } as Position,
        liquidationThreshold,
        collateralPrice,
        debtPrice,
      })
      expect(liquidationPrice3).toEqual('0.625')
    })

    it('should return 0 when debt amount is 0', () => {
      const liquidationThreshold = Percentage.createFrom({ percentage: 80 })
      const collateralPrice = '1000'
      const debtPrice = '1'

      const liquidationPrice = PositionUtils.getLiquidationPrice({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '100', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '0', token: DAI }),
        } as Position,
        liquidationThreshold,
        collateralPrice,
        debtPrice,
      })

      expect(liquidationPrice).toEqual('0')
    })
  })
})
