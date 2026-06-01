import type {
  AddressValue,
  ChainId,
  IArmadaVaultId,
  IAddress,
  IChainInfo,
  IRwaVaultInfo,
  IPrice,
  IUser,
  RoundState,
  RoundsVaultType,
  TransactionInfo,
} from '@summerfi/sdk-common'
import type { GetVaultQueryRwa, GetVaultsQueryRwa } from '@summerfi/subgraph-manager-common'

/**
 * @name IRWAManager
 * @description Interface for managing Real-World Asset (RWA) vaults.
 *              Mirrors the relevant subset of IArmadaManagerVaults but is sourced
 *              from the RWA subgraph and returns RWA-specific domain types.
 */
export interface IRWAManager {
  /**
   * @method getVaultInfoListPerChain
   * @description Retrieves the information of all RWA vaults for a given chain and institution
   *
   * @param chainId  Chain to query
   * @param clientId Institution client ID string (e.g. 'ExtDemoCorp_v2')
   *
   * @returns The information of all RWA vaults for the given chain/clientId
   */
  getVaultInfoListPerChain(params: { chainId: ChainId; clientId: string }): Promise<{
    list: IRwaVaultInfo[]
  }>

  /**
   * @method getVaultsRaw
   * @description Retrieves the raw RWA subgraph response for all vaults of a given chain
   *              and institution. This is the RWA equivalent of
   *              IArmadaManagerPositions.getVaultsRaw.
   *
   * @param chainInfo Chain to query
   * @param clientId  Institution client ID string (e.g. 'ExtDemoCorp_v2')
   *
   * @returns The raw GetVaults query result from the RWA subgraph
   */
  getVaultsRaw(params: { chainInfo: IChainInfo; clientId: string }): Promise<GetVaultsQueryRwa>

  /**
   * @method getVaultRaw
   * @description Retrieves the raw RWA subgraph response for a single vault. This is the RWA
   *              equivalent of IArmadaManagerPositions.getVaultRaw.
   *
   * @param vaultId Identifier of the vault to query (chain + fleet address)
   *
   * @returns The raw GetVault query result from the RWA subgraph
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQueryRwa>

  // ---------------------------------------------------------------------------
  // Deposit flow — RoundsVaultInput (USDC → ERC-1155 receipt → Fleet shares)
  // ---------------------------------------------------------------------------

  /**
   * @method getDepositTx
   * @description Builds the approve + RoundsVaultInput.deposit transaction pair for a whitelisted
   *              user. Mints an ERC-1155 receipt for the current open round.
   *
   * @param chainId      The chain the Fleet is on
   * @param fleetAddress The Fleet address
   * @param userAddress  The depositing user (owner + receiver of the round receipt)
   * @param assetsAmount Human-readable amount of the underlying asset (e.g. "1" = 1 USDC) to deposit.
   *                     Converted to base units using the vault's underlying-token decimals.
   */
  getDepositTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    assetsAmount: string
  }): Promise<TransactionInfo[]>

  /**
   * @method getClaimSharesTx
   * @description Builds the RoundsVaultInput.redeemExchangeAsset transaction to exchange a
   *              settled-round receipt for Fleet shares.
   *
   * @param vaultId   The Fleet vault identifier
   * @param user      The user holding the receipt (owner)
   * @param roundId   The settled round whose receipt is being exchanged
   * @param amount    Number of ERC-1155 receipt tokens to redeem
   * @param receiver  Optional alternative receiver of the Fleet shares
   */
  getClaimSharesTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    roundId: bigint
    amount: bigint
    receiver?: IAddress
  }): Promise<TransactionInfo>

  // ---------------------------------------------------------------------------
  // Withdraw flow — RoundsVaultOutput (Fleet shares → ERC-1155 receipt → USDC)
  // ---------------------------------------------------------------------------

  /**
   * @method getWithdrawTx
   * @description Builds the approve + RoundsVaultOutput.deposit transaction pair for a whitelisted
   *              user who wants to exit the Fleet. Mints an ERC-1155 receipt for the current round.
   *
   * @param chainId      The chain the Fleet is on
   * @param fleetAddress The Fleet address
   * @param userAddress  The withdrawing user (owner + receiver of the round receipt)
   * @param sharesAmount Human-readable amount of Fleet shares to deposit into the Output vault.
   *                     Converted to base units using the Output vault's underlying-token (share) decimals.
   */
  getWithdrawTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    sharesAmount: string
  }): Promise<TransactionInfo[]>

  /**
   * @method getClaimAssetsTx
   * @description Builds the RoundsVaultOutput.redeemExchangeAsset transaction to exchange a
   *              settled-round receipt for the underlying asset (e.g. USDC).
   *
   * @param vaultId   The Fleet vault identifier
   * @param user      The user holding the receipt (owner)
   * @param roundId   The settled round whose receipt is being exchanged
   * @param amount    Number of ERC-1155 receipt tokens to redeem
   * @param receiver  Optional alternative receiver of the underlying asset
   */
  getClaimAssetsTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    roundId: bigint
    amount: bigint
    receiver?: IAddress
  }): Promise<TransactionInfo>

  /**
   * @method getCancelRoundDepositTx
   * @description Builds the RoundsVaultBase.redeem transaction to return an open current-round
   *              receipt before it enters settlement (cancels a pending deposit or withdraw).
   *
   * @param chainId      The chain the Fleet is on
   * @param fleetAddress The Fleet address
   * @param userAddress  The user cancelling their position (owner of the receipt)
   * @param roundId      The current open round id (must equal getCurrentRound)
   * @param amount       Human-readable amount of the round receipt to redeem (converted to base units
   *                     using the resolved vault's underlying-token decimals). Generic name because
   *                     `vaultType` selects whether it is a USDC (Input) or share (Output) deposit.
   * @param receiverAddress Optional alternative receiver of the returned asset
   * @param vaultType    RoundsVaultType.Input (cancels a USDC deposit) or
   *                     RoundsVaultType.Output (cancels a share deposit)
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
   * @method getCurrentRound
   * @description Returns the current (open) round number for the given RoundsVault.
   *
   * @param chainId      The chain the Fleet is on
   * @param fleetAddress The Fleet address
   * @param vaultType    Whether to query the Input or Output RoundsVault
   */
  getCurrentRound(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
  }): Promise<bigint>

  /**
   * @method getRoundState
   * @description Returns the on-chain state of a specific round.
   *
   * @param chainId      The chain the Fleet is on
   * @param fleetAddress The Fleet address
   * @param roundId      The round number to query
   * @param vaultType    Whether to query the Input or Output RoundsVault
   */
  getRoundState(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    roundId: bigint
    vaultType: RoundsVaultType
  }): Promise<RoundState>

  /**
   * @method getExchangeRate
   * @description Returns the snapshotted exchange rate for a settled round
   *              (output-asset amount per unit of receipt token).
   *
   * @param chainId      The chain the Fleet is on
   * @param fleetAddress The Fleet address
   * @param roundId      A settled round number
   * @param vaultType    Whether to query the Input or Output RoundsVault
   */
  getExchangeRate(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    roundId: bigint
    vaultType: RoundsVaultType
  }): Promise<IPrice>

  /**
   * @method getReceiptBalances
   * @description Returns all ERC-1155 receipt token balances held by an account across every round id
   *              (sourced from the RWA subgraph).
   *
   * @param chainId        The chain the Fleet is on
   * @param fleetAddress   The Fleet address
   * @param accountAddress The account to query
   * @param vaultType      Whether to query the Input or Output RoundsVault
   */
  getReceiptBalances(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
    vaultType: RoundsVaultType
  }): Promise<{ roundId: bigint; balance: bigint }[]>

  // ---------------------------------------------------------------------------
  // Whitelisting (Manager set) — keyed on the Fleet address as context
  // ---------------------------------------------------------------------------

  /**
   * @method getSetWhitelistedTx
   * @description Builds the transaction to set or revoke whitelist status for a single account
   *              on the Fleet's ProtocolAccessManagerV2 context.
   *
   * @param chainId        The chain the Fleet is on
   * @param fleetAddress   The Fleet address (the whitelist context)
   * @param accountAddress The account to whitelist or de-list
   * @param allowed        true to whitelist, false to revoke
   */
  getSetWhitelistedTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
    allowed: boolean
  }): Promise<TransactionInfo>

  /**
   * @method getSetWhitelistedBatchTx
   * @description Builds the transaction to set or revoke whitelist status for multiple accounts
   *              in a single on-chain call.
   *
   * @param chainId          The chain the Fleet is on
   * @param fleetAddress     The Fleet address (the whitelist context)
   * @param accountAddresses Array of accounts to update
   * @param allowed          Parallel array of allowed flags
   */
  getSetWhitelistedBatchTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddresses: AddressValue[]
    allowed: boolean[]
  }): Promise<TransactionInfo>

  /**
   * @method getSetWhitelistOpenTx
   * @description Builds the transaction to toggle the open-whitelist flag for the Fleet context.
   *              When open, any address is considered whitelisted regardless of individual entries.
   *
   * @param chainId      The chain the Fleet is on
   * @param fleetAddress The Fleet address (the whitelist context)
   * @param isOpen       true to open the whitelist globally, false to close it
   */
  getSetWhitelistOpenTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    isOpen: boolean
  }): Promise<TransactionInfo>

  /**
   * @method isWhitelisted
   * @description Returns whether an account is whitelisted on the Fleet context
   *              (either individually or because the whitelist is open).
   *
   * @param chainId        The chain the Fleet is on
   * @param fleetAddress   The Fleet address (the whitelist context)
   * @param accountAddress The account to check
   */
  isWhitelisted(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
  }): Promise<boolean>

  /**
   * @method isWhitelistOpen
   * @description Returns whether the Fleet's whitelist is globally open
   *              (i.e. _isWhitelistOpen[fleetAddress] == true).
   *
   * @param chainId      The chain the Fleet is on
   * @param fleetAddress The Fleet address (the whitelist context)
   */
  isWhitelistOpen(params: { chainId: ChainId; fleetAddress: AddressValue }): Promise<boolean>
}
