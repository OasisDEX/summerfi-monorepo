import { useCallback, useEffect, useState } from 'react'
import { type TransactionAction } from '@summerfi/app-types'
import type BigNumber from 'bignumber.js'

import { transactionErrorsMap as errorsMap } from '@/helpers/transaction-errors'

type UseTransactionValidationParams = {
  amount: BigNumber | undefined
  positionAmount?: BigNumber
  isWithdraw: boolean
  sidebarTransactionType: TransactionAction
}

/**
 * Owns the amount/balance validation for the withdraw transaction sidebar.
 */
export const useTransactionValidation = ({
  amount,
  positionAmount,
  isWithdraw,
  sidebarTransactionType,
}: UseTransactionValidationParams) => {
  const [validationError, setValidationError] = useState<string>()

  const clearValidationError = useCallback(() => setValidationError(undefined), [])

  const isWithdrawAmountOverPosition =
    isWithdraw && !!positionAmount && !!amount && amount.isGreaterThan(positionAmount)

  useEffect(() => {
    if (isWithdraw) {
      if (amount && positionAmount && amount.isGreaterThan(positionAmount) && !validationError) {
        setValidationError(errorsMap.insufficientPositionBalanceError)
      }
      if (amount && positionAmount && !amount.isGreaterThan(positionAmount) && validationError) {
        setValidationError(undefined)
      }
    }
  }, [amount, validationError, sidebarTransactionType, positionAmount, isWithdraw])

  return {
    validationError,
    clearValidationError,
    isWithdrawAmountOverPosition,
  }
}
