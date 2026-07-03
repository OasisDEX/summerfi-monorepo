import type {
  AddressValue,
  ChainId,
  IArmadaVaultId,
  IChainInfo,
  IPrice,
  IRwaUserVaultExposure,
  IRwaVaultInfo,
  IRwaVaultMarketValue,
  RoundState,
  RoundsVaultType,
  RwaRole,
  TransactionInfo,
} from '@summerfi/sdk-common'
import type { GetVaultQueryRwa, GetVaultsQueryRwa } from '@summerfi/subgraph-manager-common'

/**
 * Client interface for the RWA (Real-World Asset) namespace.
 *
 * Mirrors the relevant subset of the Armada vaults surface but is sourced from the RWA subgraph and
 * returns RWA-specific domain types. This is the canonical, published contract for the `sdk.rwa.*`
 * methods.
 */
export interface IRwaManagerClient {
  /**
   * Retrieves the information of all RWA vaults for a given chain and institution.
   *
   * @param params.chainId - Chain to query.
   * @param params.clientId - Institution client ID string (e.g. `'ExtDemoCorp_v2'`).
   * @returns The information of all RWA vaults for the given chain/clientId.
   */
  getVaultInfoListPerChain(params: { chainId: ChainId; clientId: string }): Promise<{
    list: IRwaVaultInfo[]
  }>

  /**
   * Retrieves the raw RWA subgraph response for all vaults of a given chain and institution. The RWA
   * equivalent of `armada.users.getVaultsRaw`.
   *
   * @param params.chainInfo - Chain to query.
   * @param params.clientId - Institution client ID string (e.g. `'ExtDemoCorp_v2'`).
   * @returns The raw GetVaults query result from the RWA subgraph.
   */
  getVaultsRaw(params: { chainInfo: IChainInfo; clientId: string }): Promise<GetVaultsQueryRwa>

  /**
   * Retrieves the raw RWA subgraph response for a single vault. The RWA equivalent of
   * `armada.users.getVaultRaw`.
   *
   * @param params.vaultId - Identifier of the vault to query (chain + fleet address).
   * @returns The raw GetVault query result from the RWA subgraph.
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQueryRwa>

  // ---------------------------------------------------------------------------
  // Deposit flow — RoundsVaultInput (USDC → ERC-1155 receipt → Fleet shares)
  // ---------------------------------------------------------------------------

  /**
   * Builds the approve + `RoundsVaultInput.deposit` transaction pair for a whitelisted user. Mints an
   * ERC-1155 receipt for the current open round.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.userAddress - The depositing user (owner + receiver of the round receipt).
   * @param params.assetsAmount - Human-readable amount of the underlying asset (e.g. `"1"` = 1 USDC)
   *   to deposit. Converted to base units using the vault's underlying-token decimals.
   */
  getDepositTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    assetsAmount: string
  }): Promise<TransactionInfo[]>

  /**
   * Builds the `RoundsVaultInput.redeemExchangeAsset` transaction to exchange a settled-round receipt
   * for Fleet shares.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.userAddress - The user holding the receipt (owner).
   * @param params.roundId - The settled round whose receipt is being exchanged.
   * @param params.amount - Human-readable amount of round receipt to redeem (e.g. `"1"`). Converted to
   *   base units using the Input vault's underlying-token decimals.
   * @param params.receiverAddress - Optional alternative receiver of the Fleet shares.
   */
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

  /**
   * Builds the approve + `RoundsVaultOutput.deposit` transaction pair for a whitelisted user who wants
   * to exit the Fleet. Mints an ERC-1155 receipt for the current round.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.userAddress - The withdrawing user (owner + receiver of the round receipt).
   * @param params.sharesAmount - Human-readable amount of Fleet shares to deposit into the Output
   *   vault. Converted to base units using the Output vault's underlying-token (share) decimals.
   */
  getWithdrawTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    sharesAmount: string
  }): Promise<TransactionInfo[]>

  /**
   * Builds the `RoundsVaultOutput.redeemExchangeAsset` transaction to exchange a settled-round receipt
   * for the underlying asset (e.g. USDC).
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.userAddress - The user holding the receipt (owner).
   * @param params.roundId - The settled round whose receipt is being exchanged.
   * @param params.amount - Human-readable amount of round receipt to redeem (e.g. `"1"`). Converted to
   *   base units using the Output vault's underlying-token decimals.
   * @param params.receiverAddress - Optional alternative receiver of the underlying asset.
   */
  getClaimAssetsTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    roundId: bigint
    amount: string
    receiverAddress?: AddressValue
  }): Promise<TransactionInfo>

  /**
   * Builds the `RoundsVaultBase.redeem` transaction to return an open current-round receipt before it
   * enters settlement (cancels a pending deposit or withdraw).
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.userAddress - The user cancelling their position (owner of the receipt).
   * @param params.roundId - The current open round id (must equal `getCurrentRound`).
   * @param params.amount - Human-readable amount of the round receipt to redeem (converted to base
   *   units using the resolved vault's underlying-token decimals). Generic name because `vaultType`
   *   selects whether it is a USDC (Input) or share (Output) deposit.
   * @param params.receiverAddress - Optional alternative receiver of the returned asset.
   * @param params.vaultType - `RoundsVaultType.Input` (cancels a USDC deposit) or
   *   `RoundsVaultType.Output` (cancels a share deposit).
   */
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

  /**
   * Returns the current (open) round number for the given RoundsVault.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.vaultType - Whether to query the Input or Output RoundsVault.
   */
  getCurrentRound(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
  }): Promise<bigint>

  /**
   * Returns the on-chain state of a specific round.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.roundId - The round number to query.
   * @param params.vaultType - Whether to query the Input or Output RoundsVault.
   */
  getRoundState(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    roundId: bigint
    vaultType: RoundsVaultType
  }): Promise<RoundState>

  /**
   * Returns the snapshotted exchange rate for a settled round (output-asset amount per unit of receipt
   * token).
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.roundId - A settled round number.
   * @param params.vaultType - Whether to query the Input or Output RoundsVault.
   */
  getExchangeRate(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    roundId: bigint
    vaultType: RoundsVaultType
  }): Promise<IPrice>

  /**
   * Returns all ERC-1155 receipt token balances held by an account across every round id (sourced from
   * the RWA subgraph).
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.accountAddress - The account to query.
   * @param params.vaultType - Whether to query the Input or Output RoundsVault.
   */
  getReceiptBalances(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
    vaultType: RoundsVaultType
  }): Promise<{ roundId: bigint; balance: bigint }[]>

  /**
   * Returns a user's total economic exposure to an RWA vault, denominated in the Fleet input asset
   * (e.g. USDC) plus a USD valuation and a per-component breakdown. Stitches the three pools of the
   * RoundsVault model: `settledPosition + pendingDeposits + claimableDeposits + pendingWithdrawals`.
   * `claimableDeposits` (settled, unclaimed Input receipts) is added because those shares are held by
   * the RoundsVault, not the user, so they are absent from the per-user `position.inputTokenBalance`.
   * Pending withdrawals are share-denominated Output receipts converted via the vault `pricePerShare`;
   * claimable withdrawals are excluded.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.userAddress - The user to query.
   */
  getUserVaultExposure(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
  }): Promise<IRwaUserVaultExposure>

  /**
   * Returns the total market value (true TVL) of an RWA vault across all users, denominated in the
   * Fleet input asset plus a USD valuation and a per-component breakdown. Treats the Fleet and both
   * RoundsVaults as one system: `fleetAssets + pendingDeposits + claimableWithdrawals`, where
   * `fleetAssets` (on-chain `totalAssets()`) already accounts for settled deposits/withdrawals.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   */
  getVaultMarketValue(params: {
    chainId: ChainId
    fleetAddress: AddressValue
  }): Promise<IRwaVaultMarketValue>

  /**
   * Builds the `RoundsVaultBase.setMinPositionSize` transaction for the Input or Output RoundsVault of
   * a Fleet (manager-set config).
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.vaultType - Whether to target the Input or Output RoundsVault.
   * @param params.minimumPositionSize - Human-readable minimum position size (e.g. `"100"`). Converted
   *   to base units using the target vault's underlying-token decimals.
   */
  getSetMinimumPositionSizeTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    minimumPositionSize: string
  }): Promise<TransactionInfo>

  // ---------------------------------------------------------------------------
  // Round lifecycle control (Keeper/SuperKeeper; rollback is Governor)
  // ---------------------------------------------------------------------------

  /**
   * Builds the `RoundsVault.nextRound` transaction: closes the current open round (moving it to
   * InSettlement) and opens a new round.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.vaultType - Whether to target the Input or Output RoundsVault.
   */
  getNextRoundTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
  }): Promise<TransactionInfo>

  /**
   * Builds the `RoundsVault.setRoundSettled` transaction: marks an in-settlement round as Settled,
   * making its receipts redeemable.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.vaultType - Whether to target the Input or Output RoundsVault.
   * @param params.roundId - The round number to settle.
   */
  getSetRoundSettledTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    roundId: bigint
  }): Promise<TransactionInfo>

  /**
   * Builds the `RoundsVault.setRoundSettledBatch` transaction: settles multiple in-settlement rounds in
   * a single call.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.vaultType - Whether to target the Input or Output RoundsVault.
   * @param params.roundIds - The round numbers to settle.
   */
  getSetRoundSettledBatchTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    roundIds: bigint[]
  }): Promise<TransactionInfo>

  /**
   * Builds the `RoundsVault.retryRound` transaction: re-queues a rolled-back round for settlement.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.vaultType - Whether to target the Input or Output RoundsVault.
   * @param params.roundId - The round number to retry.
   */
  getRetryRoundTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    roundId: bigint
  }): Promise<TransactionInfo>

  /**
   * Builds the `RoundsVault.emergencyRollbackRound` transaction: rolls a stuck in-settlement round back
   * to Opened (Governor-gated recovery path).
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   * @param params.vaultType - Whether to target the Input or Output RoundsVault.
   * @param params.roundId - The round number to roll back.
   */
  getEmergencyRollbackRoundTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    roundId: bigint
  }): Promise<TransactionInfo>

  // ---------------------------------------------------------------------------
  // Fleet share-token transferability (Governor)
  // ---------------------------------------------------------------------------

  /**
   * Builds the `FleetCommander.setFleetTokenTransferability` transaction, which flips the fleet
   * share-token transferability flag (no argument — it is a toggle).
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   */
  getSetFleetTransferabilityTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
  }): Promise<TransactionInfo>

  /**
   * Returns whether the Fleet's share token is currently transferable (read the current state so
   * callers can label the toggle).
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address.
   */
  isFleetTransfersEnabled(params: {
    chainId: ChainId
    fleetAddress: AddressValue
  }): Promise<boolean>

  // ---------------------------------------------------------------------------
  // Role management (Governor) — on the institution's ProtocolAccessManagerV2
  // ---------------------------------------------------------------------------

  /**
   * Builds the transaction to grant a role to an account on the institution's
   * ProtocolAccessManager(V2), via the matching typed on-chain wrapper.
   *
   * @param params.chainId - The chain the institution is deployed on.
   * @param params.role - The role descriptor (carries a `target` contract for contract-specific roles).
   * @param params.account - The account to grant the role to.
   */
  getGrantRoleTx(params: {
    chainId: ChainId
    role: RwaRole
    account: AddressValue
  }): Promise<TransactionInfo>

  /**
   * Builds the transaction to revoke a role from an account on the institution's
   * ProtocolAccessManager(V2), via the matching typed on-chain wrapper.
   *
   * @param params.chainId - The chain the institution is deployed on.
   * @param params.role - The role descriptor (carries a `target` contract for contract-specific roles).
   * @param params.account - The account to revoke the role from.
   */
  getRevokeRoleTx(params: {
    chainId: ChainId
    role: RwaRole
    account: AddressValue
  }): Promise<TransactionInfo>

  // ---------------------------------------------------------------------------
  // Whitelisting (Manager set) — keyed on the Fleet address as context
  // ---------------------------------------------------------------------------

  /**
   * Builds the transaction to set or revoke whitelist status for a single account on the Fleet's
   * ProtocolAccessManagerV2 context.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address (the whitelist context).
   * @param params.accountAddress - The account to whitelist or de-list.
   * @param params.allowed - `true` to whitelist, `false` to revoke.
   */
  getSetWhitelistedTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
    allowed: boolean
  }): Promise<TransactionInfo>

  /**
   * Builds the transaction to set or revoke whitelist status for multiple accounts in a single
   * on-chain call.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address (the whitelist context).
   * @param params.accountAddresses - Array of accounts to update.
   * @param params.allowed - Parallel array of allowed flags.
   */
  getSetWhitelistedBatchTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddresses: AddressValue[]
    allowed: boolean[]
  }): Promise<TransactionInfo>

  /**
   * Builds the transaction to toggle the open-whitelist flag for the Fleet context. When open, any
   * address is considered whitelisted regardless of individual entries.
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address (the whitelist context).
   * @param params.isOpen - `true` to open the whitelist globally, `false` to close it.
   */
  getSetWhitelistOpenTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    isOpen: boolean
  }): Promise<TransactionInfo>

  /**
   * Returns whether an account is whitelisted on the Fleet context (either individually or because the
   * whitelist is open).
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address (the whitelist context).
   * @param params.accountAddress - The account to check.
   */
  isWhitelisted(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
  }): Promise<boolean>

  /**
   * Returns whether the Fleet's whitelist is globally open (i.e. `_isWhitelistOpen[fleetAddress] ==
   * true`).
   *
   * @param params.chainId - The chain the Fleet is on.
   * @param params.fleetAddress - The Fleet address (the whitelist context).
   */
  isWhitelistOpen(params: { chainId: ChainId; fleetAddress: AddressValue }): Promise<boolean>
}
