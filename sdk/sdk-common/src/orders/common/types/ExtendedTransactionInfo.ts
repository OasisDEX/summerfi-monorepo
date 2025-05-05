import type { ITokenAmount } from '../../../common/interfaces/ITokenAmount'
import type { IAddress } from '../../../common/interfaces/IAddress'
import type { IPrice } from '../../../common/interfaces/IPrice'
import type { IPercentage } from '../../../common/interfaces/IPercentage'
import type { Transaction } from './Transaction'
import type { IArmadaVaultId } from '../../../common/interfaces/IArmadaVaultId'

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
  Migration = 'Migration',
  Bridge = 'Bridge',
  Send = 'Send',
  VaultSwitch = 'VaultSwitch',
}

export type TransactionPriceImpact = {
  price: IPrice | null
  impact: IPercentage | null
}

export type TransactionMetadataApproval = {
  approvalAmount: ITokenAmount
  approvalSpender: IAddress
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

export type TransactionMetadataBridge = {
  fromAmount: ITokenAmount
  toAmount: ITokenAmount
  lzFee: ITokenAmount
}

export type TransactionMetadataMigration = {
  swapAmountByPositionId: Record<string, ITokenAmount>
  priceImpactByPositionId: Record<string, TransactionPriceImpact>
}

export type TransactionMetadataVaultSwitch = {
  fromVault: IArmadaVaultId
  toVault: IArmadaVaultId
  fromAmount: ITokenAmount
  toAmount?: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

type TransactionInfo = {
  transaction: Transaction
  description: string
}

export type ApproveTransactionInfo = TransactionInfo & {
  type: TransactionType.Approve
  metadata: TransactionMetadataApproval
}

export type DepositTransactionInfo = TransactionInfo & {
  type: TransactionType.Deposit
  metadata: TransactionMetadataDeposit
}

export type WithdrawTransactionInfo = TransactionInfo & {
  type: TransactionType.Withdraw
  metadata: TransactionMetadataWithdraw
}

export type VaultSwitchTransactionInfo = TransactionInfo & {
  type: TransactionType.VaultSwitch
  metadata: TransactionMetadataVaultSwitch
}

export type BridgeTransactionInfo = TransactionInfo & {
  type: TransactionType.Bridge
  metadata: TransactionMetadataBridge
}

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

export type MigrationTransactionInfo = TransactionInfo & {
  type: TransactionType.Migration
  metadata: TransactionMetadataMigration
}
