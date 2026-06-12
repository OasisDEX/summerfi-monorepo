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
  TransactionInfo,
} from '@summerfi/sdk-common'
import type { GetVaultQueryRwa, GetVaultsQueryRwa } from '@summerfi/subgraph-manager-common'

/**
 * @name IRwaManagerClient
 * @description Client interface for the RWA namespace
 */
export interface IRwaManagerClient {
  /**
   * @method getVaultInfoListPerChain
   * @description Retrieves all RWA vaults for a given chain and institution clientId
   */
  getVaultInfoListPerChain(params: { chainId: ChainId; clientId: string }): Promise<{
    list: IRwaVaultInfo[]
  }>

  /**
   * @method getVaultsRaw
   * @description Retrieves the raw RWA subgraph GetVaults response for a given chain
   *              and institution clientId. RWA equivalent of armada.users.getVaultsRaw.
   */
  getVaultsRaw(params: { chainInfo: IChainInfo; clientId: string }): Promise<GetVaultsQueryRwa>

  /**
   * @method getVaultRaw
   * @description Retrieves the raw RWA subgraph GetVault response for a single vault.
   *              RWA equivalent of armada.users.getVaultRaw.
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQueryRwa>

  // --- Deposit flow ---

  getDepositTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    assetsAmount: string
  }): Promise<TransactionInfo[]>

  getClaimSharesTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    roundId: bigint
    amount: string
    receiverAddress?: AddressValue
  }): Promise<TransactionInfo>

  // --- Withdraw flow ---

  getWithdrawTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    sharesAmount: string
  }): Promise<TransactionInfo[]>

  getClaimAssetsTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    roundId: bigint
    amount: string
    receiverAddress?: AddressValue
  }): Promise<TransactionInfo>

  getCancelRoundDepositTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    roundId: bigint
    amount: string
    receiverAddress?: AddressValue
    vaultType: RoundsVaultType
  }): Promise<TransactionInfo>

  // --- Round state reads ---

  getCurrentRound(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
  }): Promise<bigint>

  getRoundState(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    roundId: bigint
    vaultType: RoundsVaultType
  }): Promise<RoundState>

  getExchangeRate(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    roundId: bigint
    vaultType: RoundsVaultType
  }): Promise<IPrice>

  getReceiptBalances(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
    vaultType: RoundsVaultType
  }): Promise<{ roundId: bigint; balance: bigint }[]>

  getUserVaultExposure(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
  }): Promise<IRwaUserVaultExposure>

  getVaultMarketValue(params: {
    chainId: ChainId
    fleetAddress: AddressValue
  }): Promise<IRwaVaultMarketValue>

  getSetMinimumPositionSizeTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    vaultType: RoundsVaultType
    minimumPositionSize: string
  }): Promise<TransactionInfo>

  // --- Whitelisting ---

  getSetWhitelistedTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
    allowed: boolean
  }): Promise<TransactionInfo>

  getSetWhitelistedBatchTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddresses: AddressValue[]
    allowed: boolean[]
  }): Promise<TransactionInfo>

  getSetWhitelistOpenTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    isOpen: boolean
  }): Promise<TransactionInfo>

  isWhitelisted(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    accountAddress: AddressValue
  }): Promise<boolean>

  isWhitelistOpen(params: { chainId: ChainId; fleetAddress: AddressValue }): Promise<boolean>
}
