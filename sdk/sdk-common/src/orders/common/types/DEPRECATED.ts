import type {
  ApproveTransactionInfo,
  DepositTransactionInfo,
  WithdrawTransactionInfo,
} from './ExtendedTransactionInfo'

/**
 * @interface ExtendedTransactionInfo
 * @deprecated DONT TOUCH THIS!!!
 */
export type ExtendedTransactionInfo =
  | ApproveTransactionInfo
  | DepositTransactionInfo
  | WithdrawTransactionInfo
