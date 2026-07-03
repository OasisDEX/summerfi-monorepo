import type {
  AddressValue,
  ChainId,
  IArmadaVaultId,
  IChainInfo,
  IRwaUserVaultExposure,
  IRwaVaultInfo,
  IRwaVaultMarketValue,
  IPrice,
  RoundState,
  RoundsVaultType,
  RwaRole,
  TransactionInfo,
} from '@summerfi/sdk-common'
import type { GetVaultQueryRwa, GetVaultsQueryRwa } from '@summerfi/subgraph-manager-common'

/**
 * Interface for managing Real-World Asset (RWA) vaults.
 * Mirrors the relevant subset of IArmadaManagerVaults but is sourced
 * from the RWA subgraph and returns RWA-specific domain types.
 *
 * IDE-only surface — the published API docs live on the client interface `IRwaManagerClient`, which
 * holds the full per-method prose. Keep these comments as one-line summaries.
 */
export interface IRWAManager {
  /** Retrieves the information of all RWA vaults for a given chain and institution. */
  getVaultInfoListPerChain(params: { chainId: ChainId; clientId: string }): Promise<{
    list: IRwaVaultInfo[]
  }>

  /** Retrieves the raw RWA subgraph GetVaults response for a chain + institution. */
  getVaultsRaw(params: { chainInfo: IChainInfo; clientId: string }): Promise<GetVaultsQueryRwa>

  /** Retrieves the raw RWA subgraph GetVault response for a single vault. */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQueryRwa>

  // ---------------------------------------------------------------------------
  // Deposit flow — RoundsVaultInput (USDC → ERC-1155 receipt → Fleet shares)
  // ---------------------------------------------------------------------------

  /** Builds the approve + RoundsVaultInput.deposit transaction pair (deposit into the current open round). */
  getDepositTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    assetsAmount: string
  }): Promise<TransactionInfo[]>

  /** Builds the RoundsVaultInput.redeemExchangeAsset transaction (settled-round receipt → Fleet shares). */
  getClaimSharesTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    roundId: bigint
    amount: string
    receiverAddress?: AddressValue
  }): Promise<TransactionInfo>

  // ---------------------------------------------------------------------------
  // Withdraw flow — RoundsVaultOutput (Fleet shares → ERC-1155 receipt → USDC)
  // ---------------------------------------------------------------------------

  /** Builds the approve + RoundsVaultOutput.deposit transaction pair (exit the Fleet into the current round). */
  getWithdrawTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    sharesAmount: string
  }): Promise<TransactionInfo[]>

  /** Builds the RoundsVaultOutput.redeemExchangeAsset transaction (settled-round receipt → underlying asset). */
  getClaimAssetsTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    roundId: bigint
    amount: string
    receiverAddress?: AddressValue
  }): Promise<TransactionInfo>

  /** Builds the RoundsVaultBase.redeem transaction to return an open current-round receipt (cancel a pending deposit/withdraw). */
  getCancelRoundDepositTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    roundId: bigint
    amount: string
    receiverAddress?: AddressValue
    vaultType: RoundsVaultType
  }): Promise<TransactionInfo>

  // ---------------------------------------------------------------------------
  // Round state reads
  // ---------------------------------------------------------------------------

  /** Returns the current (open) round number for the given RoundsVault. */
  getCurrentRound(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
  }): Promise<bigint>

  /** Returns the on-chain state of a specific round. */
  getRoundState(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    roundId: bigint
    vaultType: RoundsVaultType
  }): Promise<RoundState>

  /** Returns the snapshotted exchange rate for a settled round. */
  getExchangeRate(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    roundId: bigint
    vaultType: RoundsVaultType
  }): Promise<IPrice>

  /** Returns all ERC-1155 receipt balances held by an account across every round id. */
  getReceiptBalances(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
    vaultType: RoundsVaultType
  }): Promise<{ roundId: bigint; balance: bigint }[]>

  /** Returns a user's total economic exposure to an RWA vault (Fleet input asset + USD + per-component breakdown). */
  getUserVaultExposure(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
  }): Promise<IRwaUserVaultExposure>

  /** Returns the total market value (true TVL) of an RWA vault across all users. */
  getVaultMarketValue(params: {
    chainId: ChainId
    fleetAddress: AddressValue
  }): Promise<IRwaVaultMarketValue>

  /** Builds the RoundsVaultBase.setMinPositionSize transaction for a Fleet's Input/Output RoundsVault. */
  getSetMinimumPositionSizeTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    minimumPositionSize: string
  }): Promise<TransactionInfo>

  // ---------------------------------------------------------------------------
  // Round lifecycle control (Keeper/SuperKeeper; rollback is Governor)
  // ---------------------------------------------------------------------------

  /** Builds the RoundsVault.nextRound transaction (close the open round, open a new one). */
  getNextRoundTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
  }): Promise<TransactionInfo>

  /** Builds the RoundsVault.setRoundSettled transaction (mark an in-settlement round Settled). */
  getSetRoundSettledTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    roundId: bigint
  }): Promise<TransactionInfo>

  /** Builds the RoundsVault.setRoundSettledBatch transaction (settle multiple in-settlement rounds). */
  getSetRoundSettledBatchTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    roundIds: bigint[]
  }): Promise<TransactionInfo>

  /** Builds the RoundsVault.retryRound transaction (re-queue a rolled-back round for settlement). */
  getRetryRoundTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    roundId: bigint
  }): Promise<TransactionInfo>

  /** Builds the RoundsVault.emergencyRollbackRound transaction (Governor recovery: roll a stuck round back to Opened). */
  getEmergencyRollbackRoundTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    roundId: bigint
  }): Promise<TransactionInfo>

  // ---------------------------------------------------------------------------
  // Fleet share-token transferability (Governor)
  // ---------------------------------------------------------------------------

  /** Builds the FleetCommander.setFleetTokenTransferability toggle transaction. */
  getSetFleetTransferabilityTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
  }): Promise<TransactionInfo>

  /** Returns whether the Fleet's share token is currently transferable. */
  isFleetTransfersEnabled(params: {
    chainId: ChainId
    fleetAddress: AddressValue
  }): Promise<boolean>

  // ---------------------------------------------------------------------------
  // Role management (Governor) — on the institution's ProtocolAccessManagerV2
  // ---------------------------------------------------------------------------

  /** Builds the transaction to grant a role on the institution's ProtocolAccessManager(V2). */
  getGrantRoleTx(params: {
    chainId: ChainId
    role: RwaRole
    account: AddressValue
  }): Promise<TransactionInfo>

  /** Builds the transaction to revoke a role on the institution's ProtocolAccessManager(V2). */
  getRevokeRoleTx(params: {
    chainId: ChainId
    role: RwaRole
    account: AddressValue
  }): Promise<TransactionInfo>

  // ---------------------------------------------------------------------------
  // Whitelisting (Manager set) — keyed on the Fleet address as context
  // ---------------------------------------------------------------------------

  /** Builds the transaction to set/revoke whitelist status for a single account on the Fleet context. */
  getSetWhitelistedTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
    allowed: boolean
  }): Promise<TransactionInfo>

  /** Builds the transaction to set/revoke whitelist status for multiple accounts in one call. */
  getSetWhitelistedBatchTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddresses: AddressValue[]
    allowed: boolean[]
  }): Promise<TransactionInfo>

  /** Builds the transaction to toggle the open-whitelist flag for the Fleet context. */
  getSetWhitelistOpenTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    isOpen: boolean
  }): Promise<TransactionInfo>

  /** Returns whether an account is whitelisted on the Fleet context. */
  isWhitelisted(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
  }): Promise<boolean>

  /** Returns whether the Fleet's whitelist is globally open. */
  isWhitelistOpen(params: { chainId: ChainId; fleetAddress: AddressValue }): Promise<boolean>
}
