import { Percentage, type Position } from '@summerfi/sdk-common/common'
import BigNumber from 'bignumber.js'

export class PositionUtils {
  static getLTV({
    position,
    collateralPrice,
    debtPrice,
  }: {
    position: Position
    collateralPrice: string
    debtPrice: string
  }): Percentage {
    // Determine the Collateral Value:
    const collValue = new BigNumber(position.collateralAmount.amount).times(collateralPrice)
    // Determine the Borrowed Value:
    const debtValue = new BigNumber(position.debtAmount.amount).times(debtPrice)
    // If the collateral value is 0, return 0.
    if (collValue.isZero()) {
      return Percentage.createFrom({ percentage: 0 })
    }
    // Divide the borrowed value by the collateral value and multiply by 100 to get the percentage LTV.
    const ltvRatio = debtValue.div(collValue).times(100).toNumber()
    return Percentage.createFrom({ percentage: ltvRatio })
  }

  static getLiquidationPrice({
    position,
    liquidationThreshold,
    debtPrice,
  }: {
    position: Position
    // TODO: passed as param because it is not defined in Position
    liquidationThreshold: Percentage
    collateralPrice: string
    debtPrice: string
  }): string {
    // Determine the Collateral Value:
    const collateralAmount = new BigNumber(position.collateralAmount.amount)
    // Determine the Borrowed Value:
    const debtAmount = new BigNumber(position.debtAmount.amount)
    // If the debt value is 0, return 0.
    if (debtAmount.isZero()) {
      return '0'
    }
    const debtValue = debtAmount.times(debtPrice)
    // (loanAmount * loanPrice) / (liquidationThreshold * collateralAmount)
    const liquidationPrice = debtValue.div(
      collateralAmount.times(liquidationThreshold.toProportion()),
    )
    return liquidationPrice.toString()
  }
}
