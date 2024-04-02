import {
  Percentage,
  type Position,
  type Price,
  type TokenAmount,
} from '@summerfi/sdk-common/common'
import { BigNumber } from 'bignumber.js'

export class PositionUtils {
  static getLTV({
    collateralTokenAmount,
    debtTokenAmount,
    collateralPriceInUsd,
    debtPriceInUsd,
  }: {
    collateralTokenAmount: TokenAmount
    debtTokenAmount: TokenAmount
    collateralPriceInUsd: Price
    debtPriceInUsd: Price
  }): Percentage {
    // Determine the Collateral Value:
    const collValue = new BigNumber(collateralTokenAmount.amount).times(collateralPriceInUsd.value)
    // Determine the Borrowed Value:
    const debtValue = new BigNumber(debtTokenAmount.amount).times(debtPriceInUsd.value)
    // If the collateral value is 0, return 0.
    if (collValue.isZero()) {
      return Percentage.createFrom({ value: 0 })
    }
    // Divide the borrowed value by the collateral value and multiply by 100 to get the percentage LTV.
    const ltvRatio = debtValue.div(collValue).times(100).toNumber()
    return Percentage.createFrom({ value: ltvRatio })
  }

  static getLiquidationPriceInUsd({
    position,
    liquidationThreshold,
    debtPriceInUsd,
  }: {
    position: Position
    // TODO: it is not defined in Position yet, we should use Pool in the future
    liquidationThreshold: Percentage
    debtPriceInUsd: Price
  }): string {
    // Determine the Collateral Value:
    const collateralAmount = new BigNumber(position.collateralAmount.amount)
    // Determine the Borrowed Value:
    const debtAmount = new BigNumber(position.debtAmount.amount)
    // If the debt value is 0, return 0.
    if (debtAmount.isZero()) {
      return '0'
    }
    const debtValue = debtAmount.times(debtPriceInUsd.value)
    // (loanAmount * loanPrice) / (liquidationThreshold * collateralAmount)
    const liquidationPrice = debtValue.div(
      collateralAmount.times(liquidationThreshold.toProportion()),
    )
    return liquidationPrice.toString()
  }
}
