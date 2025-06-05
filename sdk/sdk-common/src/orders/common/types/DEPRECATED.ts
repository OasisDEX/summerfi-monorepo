import type {
  ApproveTransactionInfo,
  DepositTransactionInfo,
  WithdrawTransactionInfo,
} from './TransactionInfoSpecialized'

/**
 * @interface ExtendedTransactionInfo
 * @deprecated WILL BE DELETED.We are deprecating this type in favor of more specific transaction info types for each transaction type.
 */
export type ExtendedTransactionInfo =
  | ApproveTransactionInfo
  | DepositTransactionInfo
  | WithdrawTransactionInfo
