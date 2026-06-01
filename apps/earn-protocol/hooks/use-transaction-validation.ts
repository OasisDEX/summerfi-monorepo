import { useCallback, useEffect, useState } from 'react'
import { type TransactionAction } from '@summerfi/app-types'
import type BigNumber from 'bignumber.js'

import { transactionErrorsMap as errorsMap } from '@/helpers/transaction-errors'

type UseTransactionValidationParams = {
  amount: BigNumber | undefined
  tokenBalance: BigNumber | undefined
  positionAmount?: BigNumber
  isDeposit: boolean
  isWithdraw: boolean
  isSwitch: boolean
  selectedSwitchVault?: `${string}-${number}`
  sidebarTransactionType: TransactionAction
}

/**
 * Owns the amount/balance validation for the transaction sidebar. Returns the
 * user-facing `validationError` message plus the synchronous balance-comparison
 * booleans the sidebar uses to disable the action button — so the comparison lives
 * in one place instead of being duplicated between the effect and the button.
 */
export const useTransactionValidation = ({
  amount,
  tokenBalance,
  positionAmount,
  isDeposit,
  isWithdraw,
  isSwitch,
  selectedSwitchVault,
  sidebarTransactionType,
}: UseTransactionValidationParams) => {
  const [validationError, setValidationError] = useState<string>()

  const clearValidationError = useCallback(() => setValidationError(undefined), [])

  const isDepositAmountOverBalance =
    isDeposit && !!tokenBalance && !!amount && amount.isGreaterThan(tokenBalance)
  const isWithdrawAmountOverPosition =
    isWithdraw && !!positionAmount && !!amount && amount.isGreaterThan(positionAmount)

  // watch for token balance changes
  useEffect(() => {
    if (isDeposit) {
      if (amount && tokenBalance && amount.isGreaterThan(tokenBalance) && !validationError) {
        setValidationError(errorsMap.insufficientBalanceError)
      }
      if (amount && tokenBalance && !amount.isGreaterThan(tokenBalance) && validationError) {
        setValidationError(undefined)
      }
    }
    if (isWithdraw) {
      if (amount && positionAmount && amount.isGreaterThan(positionAmount) && !validationError) {
        setValidationError(errorsMap.insufficientPositionBalanceError)
      }
      if (amount && positionAmount && !amount.isGreaterThan(positionAmount) && validationError) {
        setValidationError(undefined)
      }
    }
    if (isSwitch) {
      // Check vault selection first; only run the amount-vs-position check when a
      // vault is selected, so it doesn't overwrite the "select a vault" message.
      if (!selectedSwitchVault) {
        setValidationError('Please select a vault to switch to')
      } else if (amount && positionAmount && amount.isGreaterThan(positionAmount)) {
        setValidationError(errorsMap.insufficientPositionBalanceError)
      } else {
        setValidationError(undefined)
      }
    }
  }, [
    amount,
    validationError,
    tokenBalance,
    sidebarTransactionType,
    positionAmount,
    isDeposit,
    isWithdraw,
    isSwitch,
    selectedSwitchVault,
  ])

  return {
    validationError,
    clearValidationError,
    isDepositAmountOverBalance,
    isWithdrawAmountOverPosition,
  }
}
