import { TransactionAction, type TransactionWithStatus } from '@summerfi/app-types'
import {
  type ITokenAmount,
  Percentage,
  type TransactionInfo,
  TransactionType,
} from '@summerfi/sdk-common'

/**
 * The RWA SDK handlers return the bare `TransactionInfo[]` (only `transaction` +
 * `description`), whereas the shared transaction executor in `use-transaction`
 * consumes the typed `TransactionWithStatus` union (discriminated on `type`, with
 * `metadata` driving the approve/deposit screens and button labels).
 *
 * This adapter decorates the raw RWA transactions so they slot into the existing
 * flow. It mirrors the standard `[Deposit] | [Approve, Deposit]` shape:
 *  - the final transaction is the deposit/withdraw action,
 *  - any preceding transaction(s) are token approvals.
 *
 * NOTE: `metadata` is reconstructed best-effort from the known inputs because the
 * RWA SDK does not (yet) return it. Revisit once the RWA service is implemented
 * and returns typed transactions (matching the standard manager).
 */
export const buildRwaTransactions = ({
  transactions,
  action,
  fromAmount,
}: {
  transactions: TransactionInfo[]
  action: TransactionAction.DEPOSIT | TransactionAction.WITHDRAW
  fromAmount: ITokenAmount
}): TransactionWithStatus[] => {
  if (transactions.length === 0) {
    return []
  }

  const lastIndex = transactions.length - 1
  // The approval grants allowance to the contract the action transaction calls
  // (e.g. RoundsVaultInput), which is that transaction's target.
  const approvalSpender = transactions[lastIndex].transaction.target

  return transactions.map((tx, index) => {
    // Approval transaction(s) precede the action transaction.
    if (index < lastIndex) {
      return {
        ...tx,
        type: TransactionType.Approve,
        metadata: {
          approvalAmount: fromAmount,
          approvalSpender,
        },
        executed: false,
      }
    }

    const metadata = {
      fromAmount,
      // RWA deposits/withdrawals are not swap-based, so there is no slippage.
      slippage: Percentage.createFrom({ value: 0 }),
    }

    return action === TransactionAction.DEPOSIT
      ? { ...tx, type: TransactionType.Deposit, metadata, executed: false }
      : { ...tx, type: TransactionType.Withdraw, metadata, executed: false }
  })
}
