import type { TransactionInfo } from '@summerfi/sdk-common'

export const prepareTransaction = (transaction: TransactionInfo) => {
  return {
    target: transaction.transaction.target.value,
    value: BigInt(transaction.transaction.value),
    data: transaction.transaction.calldata,
  }
}
