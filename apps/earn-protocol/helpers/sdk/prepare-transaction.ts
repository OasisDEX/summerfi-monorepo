import type { TransactionInfo } from '@summerfi/sdk-client-react'

export const prepareTransaction = (transaction: TransactionInfo) => {
  return {
    target: transaction.transaction.target.value,
    value: BigInt(transaction.transaction.value),
    data: transaction.transaction.calldata,
  }
}
