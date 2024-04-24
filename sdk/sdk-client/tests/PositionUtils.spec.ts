import { Percentage, TokenAmount, type Position } from '@summerfi/sdk-common/common'

import { PositionUtils } from '../src/utils/PositionUtils'
import { WETH, DAI } from './TestUtils'

describe('PositionUtils', () => {
  const ethPriceInUsd = '1000'
  const daiPriceInUsd = '1'

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
    it('should correctly calculate liquidation price when debt amount is not 0', () => {
      const liquidationThreshold = Percentage.createFrom({ value: 80 })

      const liquidationPrice = PositionUtils.getLiquidationPriceInUsd({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '5000', token: DAI }),
        } as Position,
        liquidationThreshold,
        debtPriceInUsd: daiPriceInUsd,
      })
      expect(liquidationPrice).toEqual('3125')

      const liquidationPrice2 = PositionUtils.getLiquidationPriceInUsd({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '6000', token: DAI }),
        } as Position,
        liquidationThreshold,
        debtPriceInUsd: daiPriceInUsd,
      })
      expect(liquidationPrice2).toEqual('3750')

      const liquidationPrice3 = PositionUtils.getLiquidationPriceInUsd({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '2', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '1', token: DAI }),
        } as Position,
        liquidationThreshold,
        debtPriceInUsd: daiPriceInUsd,
      })
      expect(liquidationPrice3).toEqual('0.625')
    })

    it('should return 0 when debt amount is 0', () => {
      const liquidationThreshold = Percentage.createFrom({ value: 80 })

      const liquidationPrice = PositionUtils.getLiquidationPriceInUsd({
        position: {
          collateralAmount: TokenAmount.createFrom({ amount: '100', token: WETH }),
          debtAmount: TokenAmount.createFrom({ amount: '0', token: DAI }),
        } as Position,
        liquidationThreshold,
        debtPriceInUsd: daiPriceInUsd,
      })

      expect(liquidationPrice).toEqual('0')
    })
  })
})
