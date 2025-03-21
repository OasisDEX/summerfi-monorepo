import {
  calculateBalance,
  calculateCollateral,
  calculateCollateralPriceInDebtBasedOnLtv,
  reversePrice,
  subtractPercentage,
} from '../../helpers'
import {
  AutoTakeProfitRealized,
  FEE,
  MinimalAutoTakeProfitTriggerData,
  MinimalPositionLike,
  MinimalStopLossInformation,
  SLIPPAGE,
} from './types'
import { Logger } from '@aws-lambda-powertools/logger'

const getMax = (a: bigint, b: bigint) => (a > b ? a : b)

export const calculateNextProfit = ({
  lastProfit,
  currentPosition,
  triggerData,
  currentStopLoss,
  logger,
}: {
  lastProfit: AutoTakeProfitRealized
  currentPosition: MinimalPositionLike
  triggerData: MinimalAutoTakeProfitTriggerData
  currentStopLoss: MinimalStopLossInformation | undefined
  logger?: Logger
}): { profit: AutoTakeProfitRealized; nextPosition: MinimalPositionLike } => {
  const executionLTV = triggerData.executionLTV
  const executionPrice = getMax(
    calculateCollateralPriceInDebtBasedOnLtv({
      collateral: currentPosition.collateral,
      debt: currentPosition.debt,
      ltv: executionLTV,
    }),
    triggerData.executionPrice,
  )

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

  const stopLossExecutionPrice = currentStopLoss?.executionLTV
    ? calculateCollateralPriceInDebtBasedOnLtv({
        ltv: currentStopLoss?.executionLTV,
        collateral: collateralAfterWithdraw,
        debt: currentPosition.debt,
      })
    : undefined

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

    const afterSwap = calculateBalance(toSwap, currentPosition.debt.token, executionPrice)

    const realizedProfitInDebt = subtractPercentage(afterSwap, SLIPPAGE)

    const realizedProfitInCollateral =
      executionPrice > 0n
        ? calculateBalance(
            realizedProfitInDebt,
            currentPosition.collateral.token,
            reversePrice(executionPrice),
          )
        : {
            balance: 0n,
            token: currentPosition.collateral.token,
          }

    logger?.debug('Calculated Realized Profit In Debt', {
      base: realizedProfit.balance,
      price: executionPrice,
      toSwap: toSwap.balance,
      afterSwap: afterSwap.balance,
      inDebt: realizedProfitInDebt.balance,
      inCollateral: realizedProfitInCollateral.balance,
    })

    const totalProfitInCollateral = {
      ...lastProfit.totalProfitInCollateral,
      balance: lastProfit.totalProfitInCollateral.balance + realizedProfitInCollateral.balance,
    }

    const totalProfitInDebt = {
      ...lastProfit.totalProfitInDebt,
      balance: lastProfit.totalProfitInDebt.balance + realizedProfitInDebt.balance,
    }

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
