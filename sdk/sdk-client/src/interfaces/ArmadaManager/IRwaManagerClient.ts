import type {
  AddressValue,
  ChainId,
  IAddress,
  IArmadaVaultId,
  IChainInfo,
  IPrice,
  IRwaVaultInfo,
  IUser,
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
    vaultId: IArmadaVaultId
    user: IUser
    roundId: bigint
    amount: bigint
    receiver?: IAddress
  }): Promise<TransactionInfo>

  // --- Withdraw flow ---

  getWithdrawTx(params: {
    chainId: ChainId
    fleetAddress: AddressValue
    userAddress: AddressValue
    sharesAmount: string
  }): Promise<TransactionInfo[]>

  getClaimAssetsTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    roundId: bigint
    amount: bigint
    receiver?: IAddress
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

  getCurrentRound(params: { vaultId: IArmadaVaultId; vaultType: RoundsVaultType }): Promise<bigint>

  getRoundState(params: {
    vaultId: IArmadaVaultId
    roundId: bigint
    vaultType: RoundsVaultType
  }): Promise<RoundState>

  getExchangeRate(params: {
    vaultId: IArmadaVaultId
    roundId: bigint
    vaultType: RoundsVaultType
  }): Promise<IPrice>

  getReceiptBalances(params: {
    vaultId: IArmadaVaultId
    account: IAddress
    vaultType: RoundsVaultType
  }): Promise<{ roundId: bigint; balance: bigint }[]>

  // --- Whitelisting ---

  getSetWhitelistedTx(params: {
    vaultId: IArmadaVaultId
    account: IAddress
    allowed: boolean
  }): Promise<TransactionInfo>

  getSetWhitelistedBatchTx(params: {
    vaultId: IArmadaVaultId
    accounts: IAddress[]
    allowed: boolean[]
  }): Promise<TransactionInfo>

  getSetWhitelistOpenTx(params: {
    vaultId: IArmadaVaultId
    isOpen: boolean
  }): Promise<TransactionInfo>

  isWhitelisted(params: { vaultId: IArmadaVaultId; account: IAddress }): Promise<boolean>

  isWhitelistOpen(params: { vaultId: IArmadaVaultId }): Promise<boolean>
}
