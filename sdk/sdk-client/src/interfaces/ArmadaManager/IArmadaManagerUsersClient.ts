import {
  type GetVaultQuery,
  type GetVaultsQuery,
  type GetGlobalRebalancesQuery,
  type GetUsersActivityQuery,
  type GetUserActivityQuery,
  type MerklReward,
  type GetPositionHistoryQuery,
  type Position_Filter,
} from '@summerfi/armada-protocol-common'
import {
  BridgeTransactionInfo,
  ITokenAmount,
  IUser,
  type AddressValue,
  type ApproveTransactionInfo,
  type ArmadaMigratablePosition,
  type ArmadaMigratablePositionApy,
  type ArmadaMigrationType,
  type ChainId,
  type IChainInfo,
  type ClaimTransactionInfo,
  type DelegateTransactionInfo,
  type DepositTransactionInfo,
  type IAddress,
  type IArmadaPosition,
  type IArmadaPositionId,
  type IArmadaVaultId,
  type IArmadaVaultInfo,
  type IPercentage,
  type MerklClaimTransactionInfo,
  type IToken,
  type MigrationTransactionInfo,
  type StakeTransactionInfo,
  type ToggleAQasMerklRewardsOperatorTransactionInfo,
  type TransactionInfo,
  type Erc20TransferTransactionInfo,
  type UnstakeTransactionInfo,
  type VaultSwitchTransactionInfo,
  type WithdrawTransactionInfo,
  type HistoricalFleetRateResult,
} from '@summerfi/sdk-common'

/**
 * @interface IArmadaManagerUsersClient
 * @description Interface of the FleetCommander Users manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IArmadaManagerUsersClient {
  /**
   * @method getSummerToken
   * @description Retrieves the Summer token for a given chain
   *
   * @param chainInfo Chain information
   *
   * @returns The Summer token for the given chain
   */
  getSummerToken(params: { chainInfo: IChainInfo }): Promise<IToken>

  /**
   * @method getVaultsRaw
   * @description Retrieves all protocol vaults
   *
   * @param chainInfo Chain information
   *
   * @returns All Armada vaults
   */
  getVaultsRaw(params: { chainInfo: IChainInfo }): Promise<GetVaultsQuery>

  /**
   * @method getVaultRaw
   * @description Retrieves a specific protocol vault
   *
   * @param vaultId ID of the vault
   *
   * @returns The corresponding Armada vault
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQuery>

  /**
   * @name getGlobalRebalancesRaw
   * @description Get all rebalances per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerRebalancesQuery
   */
  getGlobalRebalancesRaw(params: { chainInfo: IChainInfo }): Promise<GetGlobalRebalancesQuery>

  /**
   * @name getUsersActivityRaw
   * @description Get all users activity per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerUsersActivityQuery
   */
  getUsersActivityRaw(params: {
    chainInfo: IChainInfo
    where?: Position_Filter
  }): Promise<GetUsersActivityQuery>

  /**
   * @name getUserActivityRaw
   * @description Get all users activity per given chain
   *
   * @param vaultId ID of the pool to retrieve
   *
   * @returns GerUserActivityQuery
   */
  getUserActivityRaw(params: {
    vaultId: IArmadaVaultId
    accountAddress: string
  }): Promise<GetUserActivityQuery>

  /**
   * @method getVaultInfo
   * @description Retrieves the information of an Armada vault by its ID
   *
   * @param vaultId ID of the vault to retrieve
   *
   * @returns The information of the corresponding Armada vault
   */
  getVaultInfo(params: { vaultId: IArmadaVaultId }): Promise<IArmadaVaultInfo>

  /**
   * @method getVaultInfoList
   * @description Retrieves the information of all Armada vaults for a given chain
   *
   * @param chainInfo Chain information
   *
   * @returns The information of all Armada vaults for the given chain
   */
  getVaultInfoList(params: { chainId: ChainId }): Promise<{
    list: IArmadaVaultInfo[]
  }>

  /**
   * @method getVaultsHistoricalRates
   * @description Retrieves historical rates for a list of fleets across chains
   * @param params.fleets Array of fleet descriptors with fleetAddress and chainId
   * @returns Array of HistoricalFleetRateResult per fleet
   */
  getVaultsHistoricalRates(params: {
    fleets: { fleetAddress: AddressValue; chainId: ChainId }[]
  }): Promise<HistoricalFleetRateResult[]>

  /**
   * @name getUserPositions
   * @description Get all of user positions in the fleet
   *
   * @param user target user
   *
   * @returns IArmadaPosition[] All user positions in the fleet
   *
   */
  getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]>

  /**
   * @method getUserPosition
   * @description Retrieves the position of a user in an Armada pool
   *
   * @param user Target user
   * @param fleetAddress Address of the fleet
   *
   * @returns The position of the user in the corresponding Armada pool
   */
  getUserPosition(params: {
    user: IUser
    fleetAddress: IAddress
  }): Promise<IArmadaPosition | undefined>

  /**
   * @method getPosition
   * @description Retrieves the position of a user in an Armada pool
   *
   * @param positionId ID of the position to retrieve
   *
   * @returns The position of the user in the corresponding Armada pool
   */
  getPosition(params: { positionId: IArmadaPositionId }): Promise<IArmadaPosition | undefined>

  /**
   * @method getPositionHistory
   * @description Retrieves historical snapshots of a position
   *
   * @param positionId The ID of the position to retrieve history for
   * @returns GetPositionHistoryQuery with hourly, daily, and weekly snapshots
   */
  getPositionHistory(params: { positionId: IArmadaPositionId }): Promise<GetPositionHistoryQuery>

  /**
   * @method getNewDepositTx
   * @description Returns the transactions needed to deposit tokens in the Fleet for a new position
   *
   * @param vaultId ID of the pool to deposit in
   * @param user Address of the user that is trying to deposit
   * @param amount Token amount to be deposited
   * @param slippage Maximum slippage allowed
   * @param shouldStake Whether the user wants to stake the deposited tokens
   * @param referralCode Referral code to be used
   *
   * @returns The transactions needed to deposit the tokens
   */
  getNewDepositTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
    referralCode?: string
  }): Promise<[DepositTransactionInfo] | [ApproveTransactionInfo, DepositTransactionInfo]>

  /**
   * @method getWithdrawTx
   * @description Returns the transactions needed to withdraw tokens from the Fleet
   *
   * @param vaultId ID of the pool to withdraw from
   * @param user user that is trying to withdraw
   * @param amount Token amount to be withdrawn
   * @param toToken Token to withdraw to
   * @param slippage Slippage tolerance
   *
   * @returns The transactions needed to withdraw the tokens
   */
  getWithdrawTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<
    | [WithdrawTransactionInfo]
    | [ApproveTransactionInfo, WithdrawTransactionInfo]
    | [ApproveTransactionInfo, ApproveTransactionInfo, WithdrawTransactionInfo]
  >

  /**
   * @method getStakedBalance
   * @description Returns the staked balance of a user in a Fleet
   *
   * @param vaultId ID of the vault to check the balance in
   * @param user Address of the user to check the balance for
   *
   * @returns The staked balance of the user in the Fleet
   */
  getStakedBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * @method getFleetBalance
   * @description Returns the balance of a user in a Fleet
   *
   * @param vaultId ID of the vault to check the balance in
   * @param user Address of the user to check the balance for
   *
   * @returns The balance of the user in the Fleet
   */
  getFleetBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * @method getTotalBalance
   * @description Returns the total balance of a user in a Fleet
   *
   * @param vaultId ID of the vault to check the balance in
   * @param user Address of the user to check the balance for
   *
   * @returns The total balance of the user in the Fleet
   */
  getTotalBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * @name getAggregatedRewards
   * @description Returns the total aggregated rewards a user is eligible to claim cross-chain
   * @param params.user The user
   * @returns Promise<{
   *  total: bigint
   *  vaultUsagePerChain: Record<number, bigint>
   *  vaultUsage: bigint
   *  merkleDistribution: bigint
   *  voteDelegation: bigint
   * }>
   * @throws Error
   */
  getAggregatedRewards: (params: { user: IUser }) => Promise<{
    total: bigint
    vaultUsagePerChain: Record<number, bigint>
    vaultUsage: bigint
    merkleDistribution: bigint
    voteDelegation: bigint
    /**
     * @deprecated use `usagePerChain` instead
     */
    perChain: Record<number, bigint>
  }>

  /**
   * @method getAggregatedRewardsIncludingMerkl
   * @description Returns the aggregated rewards of a user including Merkl rewards
   *
   * @param user Address of the user to check the rewards for
   *
   * @returns The aggregated rewards of the user including Merkl rewards
   */
  getAggregatedRewardsIncludingMerkl: (params: { user: IUser }) => Promise<{
    total: bigint
    vaultUsagePerChain: Record<number, bigint>
    vaultUsage: bigint
    merkleDistribution: bigint
    voteDelegation: bigint
  }>

  /**
   * @method getClaimableAggregatedRewards
   * @description Returns the claimable aggregated rewards of a user in a Fleet
   *
   * @param user Address of the user to check the rewards for
   *
   * @returns The claimable aggregated rewards of the user in the Fleet
   */
  getClaimableAggregatedRewards(params: { user: IUser }): Promise<{
    total: bigint
    perChain: Record<number, bigint>
  }>

  /**
   * @method getBridgeTx
   * @description Returns the bridge transaction needed to bridge tokens between chains
   *
   * @param user The user
   * @param recipient The recipient address
   * @param sourceChain The source chain
   * @param targetChain The target chain
   * @param amount The amount to bridge
   *
   * @returns The bridge transaction needed to bridge the tokens
   */
  getBridgeTx(params: {
    user: IUser
    recipient: IAddress
    sourceChain: IChainInfo
    targetChain: IChainInfo
    amount: ITokenAmount
  }): Promise<BridgeTransactionInfo[]>

  /**
   * @method getAggregatedClaimsForChainTx
   * @description Returns the multicall transaction needed to claim rewards from the Fleet
   * @param chainInfo Chain information
   * @param user Address of the user to claim rewards for
   * @param includeMerkl Whether to include Merkl rewards in the claim
   *
   * @returns The transaction needed to claim the rewards
   */
  getAggregatedClaimsForChainTx(params: {
    chainInfo: IChainInfo
    user: IUser
    includeMerkl?: boolean
  }): Promise<[ClaimTransactionInfo] | undefined>

  /**
   * @method getUserDelegatee
   * @description Returns delegatee that the account has chosen
   *
   * @param user The user
   *
   * @returns The delegatee address
   */
  getUserDelegatee(params: { user: IUser }): Promise<IAddress>

  /**
   * @method getDelegateTx
   * @description Delegates votes from the sender to delegatee
   *
   * @param user The user
   *
   * @returns The transaction information
   */
  getDelegateTx(params: { user: IUser }): Promise<[DelegateTransactionInfo]>

  /**
   * @method getErc20TokenTransferTx
   * @description Generates a transaction for transferring ERC20 tokens
   * @see IArmadaManagerUtils.getErc20TokenTransferTx
   *
   * @param chainId Chain identifier where the token exists
   * @param tokenAddress ERC20 token contract address
   * @param recipientAddress Address to receive the tokens
   * @param amount Amount of tokens to transfer
   *
   * @returns Erc20TransferTransactionInfo Transaction information for the transfer
   */
  getErc20TokenTransferTx(params: {
    chainId: ChainId
    tokenAddress: IAddress
    recipientAddress: IAddress
    amount: ITokenAmount
  }): Promise<Erc20TransferTransactionInfo[]>

  /**
   * @method getUndelegateTx
   * @description Undelegates votes from the sender
   *
   * @returns The transaction information
   */
  getUndelegateTx(): Promise<[DelegateTransactionInfo]>

  /**
   * @method getUserVotes
   * @description Returns the number of votes the user has
   *
   * @param user The user
   *
   * @returns The number of votes
   */
  getUserVotes(params: { user: IUser }): Promise<bigint>

  /**
   * @method getUserBalance
   * @description Returns the balance of the user
   *
   * @param user The user
   *
   * @returns The balance
   */
  getUserBalance(params: { user: IUser }): Promise<bigint>

  /**
   * @method getUserStakedBalance
   * @description Returns the staked balance of the user
   *
   * @param user The user
   *
   * @returns The staked balance
   */
  getUserStakedBalance(params: { user: IUser }): Promise<bigint>

  /**
   * @method getUserEarnedRewards
   * @description Returns the rewards the user has earned
   *
   * @param user The user
   *
   * @returns The rewards earned
   */
  getUserEarnedRewards(params: { user: IUser }): Promise<bigint>

  /**
   * @method getStakeTx
   * @description Returns the transaction to stake tokens
   *
   * @param user The user
   * @param amount The amount to stake
   *
   * @returns The transaction information
   */
  getStakeTx(params: {
    user: IUser
    amount: bigint
  }): Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

  /**
   * @method getUnstakeTx
   * @description Returns the transaction to unstake tokens
   *
   * @param amount The amount to unstake
   *
   * @returns The transaction information
   */
  getUnstakeTx(params: { amount: bigint }): Promise<[UnstakeTransactionInfo]>

  /**
   * @method getDelegationChainLength
   * @description Returns the length of the delegation chain
   *
   * @param user The user
   *
   * @returns The length of the delegation
   */
  getDelegationChainLength: (params: { user: IUser }) => Promise<number>

  /**
   * @method getMigratablePositions
   * @description Returns the positions that can be migrated
   *
   * @param chainInfo Chain information
   * @param user The user
   * @param migrationType The type of migration
   *
   * @returns The positions that can be migrated
   * @throws Error if the migration type is not supported
   */
  getMigratablePositions(params: {
    chainInfo: IChainInfo
    user: IUser
    migrationType?: ArmadaMigrationType
  }): Promise<{
    chainInfo: IChainInfo
    positions: ArmadaMigratablePosition[]
  }>

  /**
   * @method getMigratablePositionsApy
   * @description Returns the APY for the positions that can be migrated
   *
   * @param chainInfo Chain information
   * @param positionIds The positions to get the APY for
   *
   * @returns The APY for the positions that can be migrated
   */
  getMigratablePositionsApy(params: {
    chainInfo: IChainInfo
    positionIds: AddressValue[]
  }): Promise<{
    chainInfo: IChainInfo
    apyByPositionId: Record<string, ArmadaMigratablePositionApy>
  }>

  /**
   * @method getMigrationTx
   * @description Returns the transaction for the migration
   *
   * @param user The user
   * @param vaultId The vault id
   * @param shouldStake Should stake
   * @param slippage The slippage
   * @param positions The positions to migrate
   *
   * @returns The transaction for the migration
   * @throws Error if the migration type is not supported
   */
  getMigrationTx(params: {
    user: IUser
    vaultId: IArmadaVaultId
    shouldStake?: boolean
    slippage: IPercentage
    positionIds: AddressValue[]
  }): Promise<[ApproveTransactionInfo[], MigrationTransactionInfo] | [MigrationTransactionInfo]>

  /**
   * @name getVaultSwitchTx
   * @description Returns the transactions needed to switch from one vault to another
   *
   * @param sourceVaultId ID of the source pool
   * @param destinationVaultId ID of the destination pool
   * @param user Address of the user that is trying to switch
   * @param amount Token amount to be switched
   * @param slippage Maximum slippage allowed for the operation
   *
   * @returns An array of transactions that must be executed
   */
  getVaultSwitchTx(params: {
    sourceVaultId: IArmadaVaultId
    destinationVaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    shouldStake?: boolean
  }): Promise<
    | [VaultSwitchTransactionInfo]
    | [ApproveTransactionInfo, VaultSwitchTransactionInfo]
    | [ApproveTransactionInfo, ApproveTransactionInfo, VaultSwitchTransactionInfo]
  >

  /**
   * @name getUserMerklRewards
   * @description Gets Merkl rewards for a user across specified chains
   * @param params.address The user's address
   * @param params.chainIds Optional chain IDs to filter by (default: supported chains)
   * @param params.rewardsTokensAddresses Optional array of token addresses to filter rewards (default: all tokens)
   * @returns Promise<MerklReward[]> Array of Merkl rewards
   */
  getUserMerklRewards(params: {
    address: AddressValue
    chainIds?: ChainId[]
    rewardsTokensAddresses?: AddressValue[]
  }): Promise<{ perChain: Partial<Record<ChainId, MerklReward[]>> }>

  /**
   * @name getUserMerklClaimTx
   * @description Generates a transaction to claim Merkl rewards for a user on a specific chain
   * @param params.address The user's address
   * @param params.chainId The chain ID to claim rewards on
   * @returns Promise<[MerklClaimTransactionInfo] | undefined> Array containing the claim transaction, or undefined if no rewards to claim
   */
  getUserMerklClaimTx(params: {
    address: AddressValue
    chainId: ChainId
  }): Promise<[MerklClaimTransactionInfo] | undefined>

  /**
   * @name getReferralFeesMerklClaimTx
   * @description Generates a transaction to claim Merkl rewards for a referral on a specific chain
   * @param params.address The user's address
   * @param params.chainId The chain ID to claim rewards on
   * @param params.rewardsTokensAddresses Optional array of token addresses to claim (default: all tokens)
   * @returns Promise<[MerklClaimTransactionInfo] | undefined> Array containing the claim transaction, or undefined if no rewards to claim
   */
  getReferralFeesMerklClaimTx(params: {
    address: AddressValue
    chainId: ChainId
    rewardsTokensAddresses?: AddressValue[]
  }): Promise<[MerklClaimTransactionInfo] | undefined>

  /**
   * @name getAuthorizeAsMerklRewardsOperatorTx
   * @description Generates a transaction to toggle AdmiralsQuarters as a Merkl rewards operator for a user
   * @param params.chainId The chain ID to perform the operation on
   * @param params.user The user's address
   * @returns Promise<[ToggleAQasMerklRewardsOperatorTransactionInfo]> Array containing the toggle transaction
   */
  getAuthorizeAsMerklRewardsOperatorTx(params: {
    chainId: ChainId
    user: AddressValue
  }): Promise<[ToggleAQasMerklRewardsOperatorTransactionInfo]>

  /**
   * @name getIsAuthorizedAsMerklRewardsOperator
   * @description Checks if AdmiralsQuarters is authorized as a Merkl rewards operator for a user
   * @param params.chainId The chain ID to check authorization on
   * @param params.user The user's address
   * @returns Promise<boolean> True if AdmiralsQuarters is authorized as operator, false otherwise
   */
  getIsAuthorizedAsMerklRewardsOperator(params: {
    chainId: ChainId
    user: AddressValue
  }): Promise<boolean>

  /**
   * @name getUnstakeFleetTokensTx
   * @description Generates a transaction to unstake fleet tokens from the rewards manager
   * @param params.addressValue The user's address
   * @param params.vaultId The vault ID to unstake from (chain info is derived from vaultId.chainInfo)
   * @param params.amountValue Optional amount to unstake (if not provided, unstakes full balance)
   * @returns Promise<TransactionInfo> The transaction to unstake fleet tokens
   */
  getUnstakeFleetTokensTx(params: {
    addressValue: AddressValue
    vaultId: IArmadaVaultId
    amountValue?: string
  }): Promise<TransactionInfo>
}
