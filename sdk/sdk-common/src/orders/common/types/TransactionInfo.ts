import type { ITokenAmount } from '../../../common/interfaces/ITokenAmount'
import type { IAddress } from '../../../common/interfaces/IAddress'
import type { IPrice } from '../../../common/interfaces/IPrice'
import type { IPercentage } from '../../../common/interfaces/IPercentage'
import type { Transaction } from './Transaction'
import type { IArmadaVaultId } from '../../../common/interfaces/IArmadaVaultId'
import type { IDcaStrategy } from '../../../common/interfaces/IDcaStrategy'

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
  Erc20Transfer = 'Erc20Transfer',
  VaultSwitch = 'VaultSwitch',
  MerklClaim = 'MerklClaim',
  ToggleAQasMerklRewardsOperator = 'ToggleAQasMerklRewardsOperator',
  Permit2Authorization = 'Permit2Authorization',
  Permit2Revoke = 'Permit2Revoke',
  CreateStrategy = 'CreateStrategy',
  EditStrategy = 'EditStrategy',
  PauseStrategy = 'PauseStrategy',
  ResumeStrategy = 'ResumeStrategy',
  CancelStrategy = 'CancelStrategy',
}

export type TransactionPriceImpact = {
  price: IPrice | null
  impact: IPercentage | null
}

/**
 * @interface TransactionInfo
 * @description Contains the low level transaction plus a description of what the transaction is for.
 *              This could be used to display the transaction to the user.
 */
export interface TransactionInfo {
  /** @description Low level transaction that can be sent to the blockchain */
  transaction: Transaction
  /** @description High-level description of the transaction */
  description: string
}

export type ApproveTransactionInfo = TransactionInfo & {
  type: TransactionType.Approve
  metadata: TransactionMetadataApproval
}
export type TransactionMetadataApproval = {
  approvalAmount: ITokenAmount
  approvalSpender: IAddress
}

export type DepositTransactionInfo = TransactionInfo & {
  type: TransactionType.Deposit
  metadata: TransactionMetadataDeposit
}
export type TransactionMetadataDeposit = {
  fromAmount: ITokenAmount
  toAmount?: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

export type WithdrawTransactionInfo = TransactionInfo & {
  type: TransactionType.Withdraw
  metadata: TransactionMetadataWithdraw
}
export type TransactionMetadataWithdraw = {
  fromAmount: ITokenAmount
  toAmount?: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

export type VaultSwitchTransactionInfo = TransactionInfo & {
  type: TransactionType.VaultSwitch
  metadata: TransactionMetadataVaultSwitch
}
export type TransactionMetadataVaultSwitch = {
  fromVault: IArmadaVaultId
  toVault: IArmadaVaultId
  fromAmount: ITokenAmount
  toAmount?: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

export type MigrationTransactionInfo = TransactionInfo & {
  type: TransactionType.Migration
  metadata: TransactionMetadataMigration
}
export type TransactionMetadataMigration = {
  swapAmountByPositionId: Record<string, ITokenAmount>
  priceImpactByPositionId: Record<string, TransactionPriceImpact>
}

export type BridgeTransactionInfo = TransactionInfo & {
  type: TransactionType.Bridge
  metadata: TransactionMetadataBridge
}
export type TransactionMetadataBridge = {
  fromAmount: ITokenAmount
  toAmount: ITokenAmount
  lzFee: ITokenAmount
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

export type MerklClaimTransactionInfo = TransactionInfo & {
  type: TransactionType.MerklClaim
}

export type ToggleAQasMerklRewardsOperatorTransactionInfo = TransactionInfo & {
  type: TransactionType.ToggleAQasMerklRewardsOperator
}

export type Erc20TransferTransactionInfo = TransactionInfo & {
  type: TransactionType.Erc20Transfer
  metadata: TransactionMetadataErc20Transfer
}
export type TransactionMetadataErc20Transfer = {
  token: IAddress
  recipient: IAddress
  amount: ITokenAmount
}

export type Permit2AuthorizationTransactionInfo = TransactionInfo & {
  type: TransactionType.Permit2Authorization
}

export type Permit2RevokeTransactionInfo = TransactionInfo & {
  type: TransactionType.Permit2Revoke
}

export type CreateDcaStrategyTransactionInfo = TransactionInfo & {
  type: TransactionType.CreateStrategy
}

export type EditDcaStrategyTransactionInfo = TransactionInfo & {
  type: TransactionType.EditStrategy
  metadata: {
    strategy: IDcaStrategy
  }
}

export type PauseDcaStrategyTransactionInfo = TransactionInfo & {
  type: TransactionType.PauseStrategy
}

export type ResumeDcaStrategyTransactionInfo = TransactionInfo & {
  type: TransactionType.ResumeStrategy
  metadata: {
    strategy: IDcaStrategy
  }
}

export type CancelDcaStrategyTransactionInfo = TransactionInfo & {
  type: TransactionType.CancelStrategy
}
