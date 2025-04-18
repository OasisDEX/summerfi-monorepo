import { ILendingPosition, IPercentage, ITokenAmount, Percentage } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'

// TODO: refactor BigNumbers to use the SDK's TokenAmount operations
// TODO: refactor priceInUsd to use the SDK's Price class when FE have Position from the SDK

export class PositionUtils {
  static getLTV({
    collateralTokenAmount,
    debtTokenAmount,
    collateralPriceInUsd,
    debtPriceInUsd,
  }: {
    collateralTokenAmount: ITokenAmount
    debtTokenAmount: ITokenAmount
    collateralPriceInUsd: string
    debtPriceInUsd: string
  }): IPercentage {
    // Determine the Collateral Value:
    const collValue = new BigNumber(collateralTokenAmount.amount).times(collateralPriceInUsd)
    // Determine the Borrowed Value:
    const debtValue = new BigNumber(debtTokenAmount.amount).times(debtPriceInUsd)
    // If the collateral value is 0, return 0.
    if (collValue.isZero()) {
      return Percentage.createFrom({ value: 0 })
    }
    // Divide the borrowed value by the collateral value and multiply by 100 to get the percentage LTV.
    const ltvRatio = debtValue.div(collValue).times(100).toNumber()
    return Percentage.createFrom({ value: ltvRatio })
  }

  /**
   * This code calculates the value of one collateral token expressed in debt tokens at which the loan-to-value (LTV) ratio will be at liquidationThreshold
   */
  static getLiquidationPriceInDebtTokens({
    position,
    liquidationThreshold,
    debtPriceInUsd,
  }: {
    position: ILendingPosition
    liquidationThreshold: Percentage
    debtPriceInUsd: string
  }): string {
    const collateralAmount = new BigNumber(position.collateralAmount.amount)
    const debtAmount = new BigNumber(position.debtAmount.amount)
    // If the debt value is 0, return 0.
    if (debtAmount.isZero()) {
      return '0'
    }

    const debtValueInUSD = new BigNumber(debtAmount).times(debtPriceInUsd)

    // Determine the new collateral value in usd at the liquidationThreshold
    const newCollateralValueInUSD = debtValueInUSD.div(liquidationThreshold.toProportion())

    // Determine the new value of one collateral token at liquidationThreshold
    const newCollateralPriceInUSD = newCollateralValueInUSD.dividedBy(collateralAmount)

    // Convert the new value of one collateral token to debt tokens
    const priceOfCollateralInDebtTokens = newCollateralPriceInUSD.dividedBy(debtPriceInUsd)

    return priceOfCollateralInDebtTokens.toString()
  }
}
