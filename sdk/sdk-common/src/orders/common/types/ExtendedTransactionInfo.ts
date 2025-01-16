import type { IPercentage, IPrice, ITokenAmount } from '../../../common'
import type { Transaction } from './Transaction'

/**
 * @enum TransactionType
 * @description Enum of all the transaction types that can be performed.
 */
export enum TransactionType {
  Approve = 'Approve',
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Claim = 'Claim',
  Delegate = 'Delegate',
  Stake = 'Stake',
  Unstake = 'Unstake',
}

export type TransactionMetadataApproval = {
  approvalAmount: ITokenAmount
}

export type TransactionPriceImpact = {
  price: IPrice
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

type TransactionInfo = {
  transaction: Transaction
  description: string
}

/**
 * @interface ExtendedTransactionInfo
 * @description Contains the low level transaction plus a description of what the transaction is for.
 */
export type ExtendedTransactionInfo = TransactionInfo &
  (
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

export type ClaimTransactionInfo = TransactionInfo & {
  type: TransactionType.Claim
}

export type DelegateTransactionInfo = TransactionInfo & {
  type: TransactionType.Delegate
}

export type StakeTransactionInfo = TransactionInfo & {
  type: TransactionType.Stake
}

export type UnstakeTransactionInfo = TransactionInfo & {
  type: TransactionType.Unstake
}
