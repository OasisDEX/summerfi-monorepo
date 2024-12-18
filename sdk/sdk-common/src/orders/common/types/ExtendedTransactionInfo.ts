import type { IPercentage, ITokenAmount } from '../../../common'
import type { Transaction } from './Transaction'

/**
 * @enum TransactionType
 * @description Enum of all the transaction types that can be performed.
 */
export enum TransactionType {
  Approve = 'Approve',
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}

export type TransactionMetadataApproval = {
  approvalAmount: ITokenAmount
}

export type TransactionPriceImpact = {
  price: ITokenAmount
  impact: IPercentage
}

export type TransactionMetadataDeposit = {
  fromAmount: ITokenAmount
  toAmount?: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

export type TransactionMetadataWithdraw = {
  fromAmount: ITokenAmount
  toAmount?: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

/**
 * @interface ExtendedTransactionInfo
 * @description Contains the low level transaction plus a description of what the transaction is for.
 */
export type ExtendedTransactionInfo = {
  transaction: Transaction
  /** @description High-level description of the transaction */
  description: string
} & (
  | {
      type: TransactionType.Approve
      metadata: TransactionMetadataApproval
    }
  | {
      type: TransactionType.Deposit
      metadata: TransactionMetadataDeposit
    }
  | {
      type: TransactionType.Withdraw
      metadata: TransactionMetadataWithdraw
    }
)
