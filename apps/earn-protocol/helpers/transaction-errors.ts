export const transactionErrorsMap = {
  // our custom errors
  insufficientBalanceError: 'Insufficient balance',
  insufficientPositionBalanceError: 'Insufficient position balance',
  transactionExecutionError: 'Error executing the transaction',
  transactionRetrievalError: 'Error getting the transaction',
  // mapped package rejections
  TransactionExecutionError: 'Error executing the transaction',
}

/**
 * Resolves a user-facing message for an error thrown while executing a transaction:
 * a mapped custom error name, the viem `shortMessage` if present, or a generic
 * fallback.
 */
export const getTransactionExecutionErrorMessage = (err: unknown): string => {
  if (err instanceof Error && err.name in transactionErrorsMap) {
    return transactionErrorsMap[err.name as keyof typeof transactionErrorsMap]
  }

  if (err instanceof Error && 'shortMessage' in err && typeof err.shortMessage === 'string') {
    return `${err.shortMessage}. You can try again.`
  }

  return transactionErrorsMap.TransactionExecutionError
}
