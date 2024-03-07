import {
  calculateBalance,
  calculateCollateral,
  calculateCollateralPriceInDebtBasedOnLtv,
  reversePrice,
  subtractPercentage,
} from '~helpers'
import {
  AutoTakeProfitRealized,
  FEE,
  MinimalAutoTakeProfitTriggerData,
  MinimalPositionLike,
  SLIPPAGE,
} from './types'

export const calculateNextProfit = ({
  lastProfit,
  currentPosition,
  triggerData,
  stopLossLtv,
}: {
  lastProfit: AutoTakeProfitRealized
  currentPosition: MinimalPositionLike
  triggerData: MinimalAutoTakeProfitTriggerData
  stopLossLtv: bigint | undefined
}): { profit: AutoTakeProfitRealized; nextPosition: MinimalPositionLike } => {
  const executionLTV = triggerData.executionLTV
  const executionPrice = calculateCollateralPriceInDebtBasedOnLtv({
    collateral: currentPosition.collateral,
    debt: currentPosition.debt,
    ltv: executionLTV,
  })

  const collateralAfterWithdraw = calculateCollateral({
    position: {
      debt: currentPosition.debt,
      collateralPriceInDebt: executionPrice,
      ltv: triggerData.executionLTV + triggerData.withdrawStep,
    },
    collateralToken: currentPosition.collateral.token,
  })

  const realizedProfit = {
    ...currentPosition.collateral,
    balance: currentPosition.collateral.balance - collateralAfterWithdraw.balance,
  }

  if (triggerData.withdrawToken === currentPosition.collateral.token.address) {
    const realizedProfitInCollateral = realizedProfit

    const realizedProfitInDebt = calculateBalance(
      realizedProfitInCollateral,
      currentPosition.debt.token,
      executionPrice,
    )

    const totalProfitInCollateral = {
      ...lastProfit.totalProfitInCollateral,
      balance: lastProfit.totalProfitInCollateral.balance + realizedProfitInCollateral.balance,
    }

    const totalProfitInDebt = {
      ...lastProfit.totalProfitInDebt,
      balance: lastProfit.totalProfitInDebt.balance + realizedProfitInDebt.balance,
    }

    const stopLossExecutionPrice = stopLossLtv
      ? calculateCollateralPriceInDebtBasedOnLtv({
          ltv: stopLossLtv,
          collateral: collateralAfterWithdraw,
          debt: currentPosition.debt,
        })
      : undefined

    const totalFee = {
      ...lastProfit.totalFee,
      balance: lastProfit.totalFee.balance,
    }

    return {
      profit: {
        triggerPrice: executionPrice,
        realizedProfitInCollateral,
        realizedProfitInDebt,
        totalProfitInCollateral,
        totalProfitInDebt,
        fee: {
          balance: 0n,
          token: currentPosition.collateral.token,
        },
        totalFee,
        stopLossDynamicPrice: stopLossExecutionPrice,
      },
      nextPosition: {
        collateral: collateralAfterWithdraw,
        debt: currentPosition.debt,
        ltv: executionLTV + triggerData.withdrawStep,
        collateralPriceInDebt: executionPrice,
      },
    }
  } else {
    const toSwap = subtractPercentage(realizedProfit, FEE)

    const fee = {
      balance: realizedProfit.balance - toSwap.balance,
      token: currentPosition.collateral.token,
    }

    const afterSwap = calculateBalance(
      toSwap,
      currentPosition.debt.token,
      currentPosition.collateralPriceInDebt,
    )

    const realizedProfitInDebt = subtractPercentage(afterSwap, SLIPPAGE)

    const realizedProfitInCollateral = calculateBalance(
      realizedProfitInDebt,
      currentPosition.collateral.token,
      reversePrice(currentPosition.collateralPriceInDebt),
    )

    const totalProfitInCollateral = {
      ...lastProfit.totalProfitInCollateral,
      balance: lastProfit.totalProfitInCollateral.balance + realizedProfitInCollateral.balance,
    }

    const totalProfitInDebt = {
      ...lastProfit.totalProfitInDebt,
      balance: lastProfit.totalProfitInDebt.balance + realizedProfitInDebt.balance,
    }

    const stopLossExecutionPrice = stopLossLtv
      ? calculateCollateralPriceInDebtBasedOnLtv({
          ltv: executionLTV,
          collateral: collateralAfterWithdraw,
          debt: currentPosition.debt,
        })
      : undefined

    const totalFee = {
      ...lastProfit.totalFee,
      balance: lastProfit.totalFee.balance + fee.balance,
    }

    return {
      profit: {
        triggerPrice: executionPrice,
        realizedProfitInCollateral,
        realizedProfitInDebt,
        totalProfitInCollateral,
        totalProfitInDebt,
        stopLossDynamicPrice: stopLossExecutionPrice,
        fee,
        totalFee,
      },
      nextPosition: {
        collateral: collateralAfterWithdraw,
        debt: currentPosition.debt,
        ltv: executionLTV + triggerData.withdrawStep,
        collateralPriceInDebt: executionPrice,
      },
    }
  }
}
