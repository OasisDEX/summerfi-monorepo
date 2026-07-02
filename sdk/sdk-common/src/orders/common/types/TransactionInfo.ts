import type { ITokenAmount } from '../../../common/interfaces/ITokenAmount'
import type { IAddress } from '../../../common/interfaces/IAddress'
import type { IPrice } from '../../../common/interfaces/IPrice'
import type { IPercentage } from '../../../common/interfaces/IPercentage'
import type { Transaction } from './Transaction'
import type { IArmadaVaultId } from '../../../common/interfaces/IArmadaVaultId'
import type { IDcaStrategy } from '../../../common/interfaces/IDcaStrategy'

/**
 * Enum of all the transaction types that can be performed.
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

/** Price and percentage impact of a transaction on the traded asset's price. */
export type TransactionPriceImpact = {
  price: IPrice | null
  impact: IPercentage | null
}

/**
 * Contains the low level transaction plus a description of what the transaction is for.
 * This could be used to display the transaction to the user.
 */
export interface TransactionInfo {
  /** Low level transaction that can be sent to the blockchain */
  transaction: Transaction
  /** High-level description of the transaction */
  description: string
}

/** Transaction info for an ERC-20 token approval. */
export type ApproveTransactionInfo = TransactionInfo & {
  type: TransactionType.Approve
  metadata: TransactionMetadataApproval
}
/** Metadata for an approval transaction: the amount approved and the spender. */
export type TransactionMetadataApproval = {
  approvalAmount: ITokenAmount
  approvalSpender: IAddress
}

/** Transaction info for a vault deposit. */
export type DepositTransactionInfo = TransactionInfo & {
  type: TransactionType.Deposit
  metadata: TransactionMetadataDeposit
}
/** Metadata for a deposit transaction: amounts, optional price impact and slippage. */
export type TransactionMetadataDeposit = {
  fromAmount: ITokenAmount
  toAmount?: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

/** Transaction info for a vault withdrawal. */
export type WithdrawTransactionInfo = TransactionInfo & {
  type: TransactionType.Withdraw
  metadata: TransactionMetadataWithdraw
}
/** Metadata for a withdrawal transaction: amounts, optional price impact and slippage. */
export type TransactionMetadataWithdraw = {
  fromAmount: ITokenAmount
  toAmount?: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

/** Transaction info for moving funds from one vault to another. */
export type VaultSwitchTransactionInfo = TransactionInfo & {
  type: TransactionType.VaultSwitch
  metadata: TransactionMetadataVaultSwitch
}
/** Metadata for a vault-switch transaction: source/target vaults, amounts, price impact and slippage. */
export type TransactionMetadataVaultSwitch = {
  fromVault: IArmadaVaultId
  toVault: IArmadaVaultId
  fromAmount: ITokenAmount
  toAmount?: ITokenAmount
  priceImpact?: TransactionPriceImpact
  slippage: IPercentage
}

/** Transaction info for migrating positions into an Armada vault. */
export type MigrationTransactionInfo = TransactionInfo & {
  type: TransactionType.Migration
  metadata: TransactionMetadataMigration
}
/** Metadata for a migration transaction: per-position swap amounts and price impacts. */
export type TransactionMetadataMigration = {
  swapAmountByPositionId: Record<string, ITokenAmount>
  priceImpactByPositionId: Record<string, TransactionPriceImpact>
}

/** Transaction info for a cross-chain bridge transfer. */
export type BridgeTransactionInfo = TransactionInfo & {
  type: TransactionType.Bridge
  metadata: TransactionMetadataBridge
}
/** Metadata for a bridge transaction: source/destination amounts and the LayerZero fee. */
export type TransactionMetadataBridge = {
  fromAmount: ITokenAmount
  toAmount: ITokenAmount
  lzFee: ITokenAmount
}

/** Transaction info for claiming rewards. */
export type ClaimTransactionInfo = TransactionInfo & {
  type: TransactionType.Claim
}

/** Transaction info for delegating voting power. */
export type DelegateTransactionInfo = TransactionInfo & {
  type: TransactionType.Delegate
}

/** Transaction info for staking tokens. */
export type StakeTransactionInfo = TransactionInfo & {
  type: TransactionType.Stake
}

/** Transaction info for unstaking tokens. */
export type UnstakeTransactionInfo = TransactionInfo & {
  type: TransactionType.Unstake
}

/** Transaction info for claiming Merkl rewards. */
export type MerklClaimTransactionInfo = TransactionInfo & {
  type: TransactionType.MerklClaim
}

/** Transaction info for toggling Admirals Quarters as a Merkl rewards operator. */
export type ToggleAQasMerklRewardsOperatorTransactionInfo = TransactionInfo & {
  type: TransactionType.ToggleAQasMerklRewardsOperator
}

/** Transaction info for a plain ERC-20 token transfer. */
export type Erc20TransferTransactionInfo = TransactionInfo & {
  type: TransactionType.Erc20Transfer
  metadata: TransactionMetadataErc20Transfer
}
/** Metadata for an ERC-20 transfer transaction: token, recipient and amount. */
export type TransactionMetadataErc20Transfer = {
  token: IAddress
  recipient: IAddress
  amount: ITokenAmount
}

/** Transaction info for granting a Permit2 authorization. */
export type Permit2AuthorizationTransactionInfo = TransactionInfo & {
  type: TransactionType.Permit2Authorization
}

/** Transaction info for revoking a Permit2 authorization. */
export type Permit2RevokeTransactionInfo = TransactionInfo & {
  type: TransactionType.Permit2Revoke
}

/** Transaction info for creating a DCA strategy. */
export type CreateDcaStrategyTransactionInfo = TransactionInfo & {
  type: TransactionType.CreateStrategy
}

/** Transaction info for editing a DCA strategy, carrying the updated strategy. */
export type EditDcaStrategyTransactionInfo = TransactionInfo & {
  type: TransactionType.EditStrategy
  metadata: {
    strategy: IDcaStrategy
  }
}

/** Transaction info for pausing a DCA strategy. */
export type PauseDcaStrategyTransactionInfo = TransactionInfo & {
  type: TransactionType.PauseStrategy
}

/** Transaction info for resuming a DCA strategy, carrying the affected strategy. */
export type ResumeDcaStrategyTransactionInfo = TransactionInfo & {
  type: TransactionType.ResumeStrategy
  metadata: {
    strategy: IDcaStrategy
  }
}

/** Transaction info for cancelling a DCA strategy. */
export type CancelDcaStrategyTransactionInfo = TransactionInfo & {
  type: TransactionType.CancelStrategy
}
