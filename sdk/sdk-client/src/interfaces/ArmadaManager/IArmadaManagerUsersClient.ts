import {
  type GetVaultQuery,
  type GetVaultsQuery,
  type GetGlobalRebalancesQuery,
  type GetUsersActivityQuery,
  type GetUserActivityQuery,
  type MerklReward,
  type GetPositionHistoryQuery,
  type Position_Filter,
  type StakingBucketInfo,
  type UserStakingBalanceByBucket,
  type UserStakeV2,
  type StakingRewardRates,
  type StakingSimulationDataV2,
  type StakingEarningsEstimationForStakesV2,
  type StakingStatsV2,
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
  type StakingStake,
  type ToggleAQasMerklRewardsOperatorTransactionInfo,
  type TransactionInfo,
  type Erc20TransferTransactionInfo,
  type UnstakeTransactionInfo,
  type VaultSwitchTransactionInfo,
  type WithdrawTransactionInfo,
  type HistoricalFleetRateResult,
  type IArmadaDeposit,
  type IArmadaWithdrawal,
} from '@summerfi/sdk-common'

/**
 * Interface of the FleetCommander Users manager for the SDK Client. Allows to instantiate
 * FleetCommanders to interact with them
 */
export interface IArmadaManagerUsersClient {
  /**
   * Retrieves the Summer token for a given chain
   *
   * @param params.chainInfo Chain information
   *
   * @returns The Summer token for the given chain
   */
  getSummerToken(params: { chainInfo: IChainInfo }): Promise<IToken>

  /**
   * Retrieves the current price of the Summer token
   *
   * @param params - Optional parameters
   * @param params.override - Optional price override value
   * @returns The current price of the Summer token
   */
  getSummerPrice(params?: { override?: number }): Promise<{ price: number }>

  /**
   * Retrieves all protocol vaults
   *
   * @param params.chainInfo Chain information
   *
   * @returns All Armada vaults
   */
  getVaultsRaw(params: { chainInfo: IChainInfo }): Promise<GetVaultsQuery>

  /**
   * Retrieves a specific protocol vault
   *
   * @param params.vaultId ID of the vault
   *
   * @returns The corresponding Armada vault
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQuery>

  /**
   * Get all rebalances per given chain
   *
   * @param params.chainInfo Chain information
   *
   * @returns GerRebalancesQuery
   */
  getGlobalRebalancesRaw(params: { chainInfo: IChainInfo }): Promise<GetGlobalRebalancesQuery>

  /**
   * Get all users activity per given chain
   *
   * @param params.chainInfo Chain information
   *
   * @returns GerUsersActivityQuery
   */
  getUsersActivityRaw(params: {
    chainInfo: IChainInfo
    where?: Position_Filter
  }): Promise<GetUsersActivityQuery>

  /**
   * Get all users activity per given chain
   *
   * @param params.vaultId ID of the pool to retrieve
   *
   * @returns GerUserActivityQuery
   */
  getUserActivityRaw(params: {
    vaultId: IArmadaVaultId
    accountAddress: string
  }): Promise<GetUserActivityQuery>

  /**
   * Retrieves the information of an Armada vault by its ID
   *
   * @param params.vaultId ID of the vault to retrieve
   *
   * @returns The information of the corresponding Armada vault
   */
  getVaultInfo(params: { vaultId: IArmadaVaultId }): Promise<IArmadaVaultInfo>

  /**
   * Retrieves the information of all Armada vaults for a given chain
   *
   * @param params.chainId The chain ID to list vaults for
   *
   * @returns The information of all Armada vaults for the given chain
   */
  getVaultInfoList(params: { chainId: ChainId }): Promise<{
    list: IArmadaVaultInfo[]
  }>

  /**
   * Calculates the total protocol revenue amount in USD across all vaults and chains
   *
   * @returns The revenue amount in USD as a number
   */
  getProtocolRevenue(): Promise<number>

  /**
   * Calculates the total protocol TVL in USD across all vaults and chains
   *
   * @returns The TVL amount in USD as a number
   */
  getProtocolTvl(): Promise<number>

  /**
   * Retrieves historical rates for a list of fleets across chains
   *
   * @param params.fleets Array of fleet descriptors with fleetAddress and chainId
   * @returns Array of HistoricalFleetRateResult per fleet
   */
  getVaultsHistoricalRates(params: {
    fleets: { fleetAddress: AddressValue; chainId: ChainId }[]
  }): Promise<HistoricalFleetRateResult[]>

  /**
   * Get all of user positions in the fleet
   *
   * @param params.user target user
   *
   * @returns IArmadaPosition[] All user positions in the fleet
   *
   */
  getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]>

  /**
   * Retrieves the position of a user in an Armada pool
   *
   * @param params.user Target user
   * @param params.fleetAddress Address of the fleet
   *
   * @returns The position of the user in the corresponding Armada pool
   */
  getUserPosition(params: {
    user: IUser
    fleetAddress: IAddress
  }): Promise<IArmadaPosition | undefined>

  /**
   * Retrieves the position of a user in an Armada pool
   *
   * @param params.positionId ID of the position to retrieve
   *
   * @returns The position of the user in the corresponding Armada pool
   */
  getPosition(params: { positionId: IArmadaPositionId }): Promise<IArmadaPosition | undefined>

  /**
   * Retrieves historical snapshots of a position
   *
   * @param params.positionId The ID of the position to retrieve history for
   * @returns GetPositionHistoryQuery with hourly, daily, and weekly snapshots
   */
  getPositionHistory(params: { positionId: IArmadaPositionId }): Promise<GetPositionHistoryQuery>

  /**
   * Get deposits for a given Armada position ID with optional pagination
   *
   * @param params.positionId Position ID
   * @param params.first Optional number of items to return
   * @param params.skip Optional number of items to skip for pagination
   *
   * @returns Array of deposit transactions with amount, timestamp, and vault balance
   */
  getDeposits(params: {
    positionId: IArmadaPositionId
    first?: number
    skip?: number
  }): Promise<IArmadaDeposit[]>

  /**
   * Get withdrawals for a given Armada position ID with optional pagination
   *
   * @param params.positionId Position ID
   * @param params.first Optional number of items to return
   * @param params.skip Optional number of items to skip for pagination
   *
   * @returns Array of withdrawal transactions with amount, timestamp, and vault balance
   */
  getWithdrawals(params: {
    positionId: IArmadaPositionId
    first?: number
    skip?: number
  }): Promise<IArmadaWithdrawal[]>

  /**
   * Returns the transactions needed to deposit tokens in the Fleet for a new position
   *
   * @param params.vaultId ID of the pool to deposit in
   * @param params.user Address of the user that is trying to deposit
   * @param params.amount Token amount to be deposited
   * @param params.slippage Maximum slippage allowed
   * @param params.shouldStake Whether the user wants to stake the deposited tokens
   * @param params.referralCode Referral code to be used
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
   * Returns the transactions needed to withdraw tokens from the Fleet
   *
   * @param params.vaultId ID of the pool to withdraw from
   * @param params.user user that is trying to withdraw
   * @param params.amount Token amount to be withdrawn
   * @param params.toToken Token to withdraw to
   * @param params.slippage Slippage tolerance
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
   * Returns the transactions needed to deposit tokens cross-chain into a Fleet using Enso routing
   *
   * @param params.fromChainId Source chain ID where user has tokens
   * @param params.vaultId ID of the pool to deposit in on destination chain
   * @param params.senderAddressValue Address of the user that is sending tokens
   * @param params.receiverAddressValue Optional address to receive the vault shares (defaults to senderAddressValue)
   * @param params.amount Token amount to be deposited from source chain
   * @param params.slippage Maximum slippage allowed for the operation
   *
   * @returns The transactions needed to deposit the tokens cross-chain
   */
  getCrossChainDepositTx(params: {
    fromChainId: ChainId
    vaultId: IArmadaVaultId
    senderAddressValue: AddressValue
    receiverAddressValue?: AddressValue
    amount: ITokenAmount
    slippage: IPercentage
  }): Promise<[DepositTransactionInfo] | [ApproveTransactionInfo, DepositTransactionInfo]>

  /**
   * Returns the transactions needed to withdraw tokens cross-chain from a Fleet using Enso routing
   *
   * @param params.vaultId ID of the pool to withdraw from
   * @param params.user user that is trying to withdraw
   * @param params.amount Token amount to be withdrawn
   * @param params.slippage Maximum slippage allowed for the operation (in basis points)
   * @param params.toChainId Destination chain ID where user wants to receive tokens
   *
   * @returns The transactions needed to withdraw the tokens cross-chain
   */
  getCrossChainWithdrawTx(params: {
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    toChainId: ChainId
  }): Promise<[WithdrawTransactionInfo] | [ApproveTransactionInfo, WithdrawTransactionInfo]>

  /**
   * Returns the staked balance of a user in a Fleet
   *
   * @param params.vaultId ID of the vault to check the balance in
   * @param params.user Address of the user to check the balance for
   *
   * @returns The staked balance of the user in the Fleet
   */
  getStakedBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * Returns the balance of a user in a Fleet
   *
   * @param params.vaultId ID of the vault to check the balance in
   * @param params.user Address of the user to check the balance for
   *
   * @returns The balance of the user in the Fleet
   */
  getFleetBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * Returns the total balance of a user in a Fleet
   *
   * @param params.vaultId ID of the vault to check the balance in
   * @param params.user Address of the user to check the balance for
   *
   * @returns The total balance of the user in the Fleet
   */
  getTotalBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * Returns the total aggregated rewards a user is eligible to claim cross-chain
   *
   * @param params.user The user
   * @returns Promise<{
   *  total: bigint
   *  vaultUsagePerChain: Record<number, bigint>
   *  vaultUsage: bigint
   *  stakingV2: bigint
   *  merkleDistribution: bigint
   *  voteDelegation: bigint
   * }>
   * @throws Error
   */
  getAggregatedRewards: (params: { user: IUser }) => Promise<{
    total: bigint
    vaultUsagePerChain: Record<number, bigint>
    vaultUsage: bigint
    distribution: bigint
    voteDelegation: bigint
    perChain: Record<number, bigint>
    stakingV2: bigint
  }>

  /**
   * Returns the aggregated rewards of a user including Merkl rewards
   *
   * @param params.user Address of the user to check the rewards for
   *
   * @returns The aggregated rewards of the user including Merkl rewards
   */
  getAggregatedRewardsIncludingMerkl: (params: { user: IUser }) => Promise<{
    total: bigint
    vaultUsagePerChain: Record<number, bigint>
    vaultUsage: bigint
    distribution: bigint
    voteDelegation: bigint
    perChain: Record<number, bigint>
    stakingV2: bigint
  }>

  /**
   * Returns the bridge transaction needed to bridge tokens between chains
   *
   * @param params.user The user
   * @param params.recipient The recipient address
   * @param params.sourceChain The source chain
   * @param params.targetChain The target chain
   * @param params.amount The amount to bridge
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
   * Returns the multicall transaction needed to claim rewards from the Fleet
   *
   * @param params.chainInfo Chain information
   * @param params.user Address of the user to claim rewards for
   * @param params.includeMerkl Whether to include Merkl rewards in the claim
   * @param params.includeStakingV2 Whether to include Staking V2 rewards in the claim
   *
   * @returns The transaction needed to claim the rewards
   */
  getAggregatedClaimsForChainTx(params: {
    chainInfo: IChainInfo
    user: IUser
    includeMerkl?: boolean
    includeStakingV2?: boolean
  }): Promise<[ClaimTransactionInfo] | undefined>

  /**
   * Returns delegatee that the account has chosen
   *
   * @param params.user The user
   *
   * @returns The delegatee address
   */
  getUserDelegatee(params: { user: IUser }): Promise<IAddress>

  /**
   * Returns delegatee configured on the staked SUMR contract (V2)
   *
   * @param params.userAddress Address whose delegatee should be fetched
   *
   * @returns The delegatee address saved in the staking contract
   */
  getUserDelegateeV2(params: { userAddress: AddressValue }): Promise<IAddress>

  /**
   * Delegates votes from the sender to delegatee
   *
   * @param params.user The user
   *
   * @returns The transaction information
   */
  getDelegateTx(params: { user: IUser }): Promise<[DelegateTransactionInfo]>

  /**
   * Delegates votes for the staked SUMR contract (V2)
   *
   * @param params.delegateeAddress Address that should receive delegated votes
   *
   * @returns The transaction information
   */
  getDelegateTxV2(params: { delegateeAddress: AddressValue }): Promise<[DelegateTransactionInfo]>

  /**
   * Generates a transaction for transferring ERC20 tokens
   *
   * @see IArmadaManagerUtils.getErc20TokenTransferTx
   *
   * @param params.chainId Chain identifier where the token exists
   * @param params.tokenAddress ERC20 token contract address
   * @param params.recipientAddress Address to receive the tokens
   * @param params.amount Amount of tokens to transfer
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
   * Undelegates votes from the sender
   *
   * @returns The transaction information
   */
  getUndelegateTx(): Promise<[DelegateTransactionInfo]>

  /**
   * Returns the number of votes the user has
   *
   * @param params.user The user
   *
   * @returns The number of votes
   */
  getUserVotes(params: { user: IUser }): Promise<bigint>

  /**
   * Returns the balance of the user
   *
   * @param params.user The user
   *
   * @returns The balance
   */
  getUserBalance(params: { user: IUser }): Promise<bigint>

  /**
   * Returns the staked balance of the user
   *
   * @param params.user The user
   *
   * @returns The staked balance
   */
  getUserStakedBalance(params: { user: IUser }): Promise<bigint>

  /**
   * Returns the rewards the user has earned
   *
   * @param params.user The user
   *
   * @returns The rewards earned
   */
  getUserEarnedRewards(params: { user: IUser }): Promise<bigint>

  /**
   * Returns the transaction to stake tokens
   *
   * @param params.user The user
   * @param params.amount The amount to stake
   *
   * @returns The transaction information
   */
  getStakeTx(params: {
    user: IUser
    amount: bigint
  }): Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

  /**
   * Returns the transaction to unstake tokens
   *
   * @param params.amount The amount to unstake
   *
   * @returns The transaction information
   */
  getUnstakeTx(params: { amount: bigint }): Promise<[UnstakeTransactionInfo]>

  /**
   * Returns the length of the delegation chain
   *
   * @param params.user The user
   *
   * @returns The length of the delegation
   */
  getDelegationChainLength: (params: { user: IUser }) => Promise<number>

  /**
   * Returns the transaction to stake tokens with lockup (V2)
   *
   * @param params.user The user
   * @param params.amount The amount to stake
   * @param params.lockupPeriod The lockup period in seconds (14 days to 3 years)
   *
   * @returns The transaction information
   */
  getStakeTxV2(params: {
    user: IUser
    amount: bigint
    lockupPeriod: bigint
  }): Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

  /**
   * Returns the transaction to stake tokens on behalf with lockup (V2)
   *
   * @param params.user The user initiating the stake
   * @param params.receiver The address receiving the staked tokens
   * @param params.amount The amount to stake
   * @param params.lockupPeriod The lockup period in seconds (14 days to 3 years)
   *
   * @returns The transaction information
   */
  getStakeOnBehalfTxV2(params: {
    user: IUser
    receiver: IAddress
    amount: bigint
    lockupPeriod: bigint
  }): Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

  /**
   * Returns the transaction to unstake tokens from a specific stake in the user's portfolio (V2)
   *
   * @param params.user The user
   * @param params.userStakeIndex The index of the stake in the user's stake array (portfolio) to unstake from
   * @param params.amount The amount to unstake
   *
   * @returns The transaction information
   */
  getUnstakeTxV2(params: {
    user: IUser
    userStakeIndex: bigint
    amount: bigint
  }): Promise<[ApproveTransactionInfo, UnstakeTransactionInfo] | [UnstakeTransactionInfo]>

  /**
   * Returns the number of stakes a user has before and after considering a specific bucket
   *
   * @param params.user The user
   *
   * @returns Object containing userStakesCountBefore and userStakesCountAfter
   */
  getUserStakesCount(params: {
    user: IUser
  }): Promise<{ userStakesCountBefore: bigint; userStakesCountAfter: bigint }>

  /**
   * Returns all staking positions for a user with detailed information
   *
   * @param params.user The user to get staking positions for
   *
   * @returns Array of user stake positions
   */
  getUserStakesV2(params: { user: IUser }): Promise<UserStakeV2[]>

  /**
   * Retrieves all staking stakes across all users with pagination support (V2)
   *
   * @param params.first number of items to return (optional, defaults to 1000)
   * @param params.skip number of items to skip for pagination (optional, defaults to 0)
   *
   * @returns Array of StakingStake objects representing the staking stakes, sorted by lockupPeriod in descending order
   */
  getStakingStakesV2(params?: { first?: number; skip?: number }): Promise<StakingStake[]>

  /**
   * Calculates the penalty percentage for early unstaking of multiple stakes
   *
   * @param params.userStakes Array of user stake details
   *
   * @returns Array of penalty percentages (IPercentage objects)
   */
  getCalculatePenaltyPercentage(params: {
    userStakes: { lockupEndTime: number }[]
  }): Promise<IPercentage[]>

  /**
   * Calculates the penalty amount for early unstaking of specific amounts from multiple stakes
   *
   * @param params.userStakes Array of user stake details
   * @param params.amounts Array of amounts to unstake (must match userStakes length)
   *
   * @returns Array of penalty amounts in tokens
   */
  getCalculatePenaltyAmount(params: {
    userStakes: { lockupEndTime: number }[]
    amounts: bigint[]
  }): Promise<bigint[]>

  /**
   * Returns the user's staking balance for each bucket (V2)
   *
   * @param params.user The user
   *
   * @returns Array of balances by bucket
   */
  getUserStakingBalanceV2(params: { user: IUser }): Promise<UserStakingBalanceByBucket[]>

  /**
   * Returns the user's weighted staking balance for all buckets (V2)
   *
   * @param params.user The user
   *
   * @returns The weighted balance
   */
  getUserStakingWeightedBalanceV2(params: { user: IUser }): Promise<bigint>

  /**
   * Returns the user's current blended yield boost based on their weighted balance and staked balance
   *
   * @param params.user The user to get the blended yield boost for
   *
   * @returns The user's blended yield boost (userWeightedBalance / userSumrStakedBalance)
   */
  getUserBlendedYieldBoost(params: { user: IUser }): Promise<number>

  /**
   * Returns the user's earned rewards (V2)
   *
   * @param params.user The user
   * @param params.rewardTokenAddress The reward token address
   *
   * @returns The earned rewards
   */
  getUserStakingEarnedV2(params: { user: IUser; rewardTokenAddress?: IAddress }): Promise<bigint>
  /**
   * Returns the total amount of SUMR tokens staked by the user across all buckets
   *
   * @param params.user The user to get staking balance for
   *
   * @returns The total SUMR amount staked
   */
  getUserStakingSumrStaked(params: { user: IUser }): Promise<bigint>

  /**
   * Returns the staking reward rates including user-specific boost (V2)
   *
   * @param params.rewardTokenAddress Optional reward token address (defaults to SUMR token)
   * @param params.sumrPriceUsd Optional SUMR price in USD (defaults to current price from utils)
   *
   * @returns Reward rates including APR, APY, and user's boosted multiplier
   */
  getStakingRewardRatesV2(params: {
    rewardTokenAddress?: IAddress
    sumrPriceUsd?: number
  }): Promise<StakingRewardRates>

  /**
   * Returns information about all staking buckets (V2)
   *
   * @returns Array of bucket information
   */
  getStakingBucketsInfoV2(): Promise<StakingBucketInfo[]>

  /**
   * Calculates the weighted stake for a given amount and lockup period
   *
   * @param params.amount - The amount to stake
   * @param params.lockupPeriod - The lockup period in seconds
   * @returns The weighted stake amount as bigint
   */
  getStakingCalculateWeightedStakeV2(params: {
    amount: bigint
    lockupPeriod: bigint
  }): Promise<bigint>

  /**
   * Returns the total weighted supply of staked tokens
   *
   * @returns The total weighted supply as bigint
   */
  getStakingTotalWeightedSupplyV2(): Promise<bigint>

  /**
   * Returns the total amount of SUMR tokens staked across all buckets
   *
   * @returns The total staked amount as bigint
   */
  getStakingTotalSumrStakedV2(): Promise<bigint>

  /**
   * Returns the revenue share percentage for stakers and the calculated amount
   *
   * @returns Object containing the revenue share percentage and calculated amount in USD
   */
  getStakingRevenueShareV2(): Promise<{ percentage: IPercentage; amount: number }>

  /**
   * Calculates staking simulation data including yield APYs and boosts
   *
   * @param params.amount The amount to stake
   * @param params.period The lockup period in seconds
   * @param params.sumrPriceUsd Optional SUMR token price in USD (defaults to current price from utils)
   * @param params.userAddress The user's wallet address
   *
   * @returns Simulation data including APYs and yield boosts
   */
  getStakingSimulationDataV2(params: {
    amount: bigint
    period: bigint
    sumrPriceUsd?: number
    userAddress: AddressValue
  }): Promise<StakingSimulationDataV2>

  /**
   * Calculates the earnings estimation for multiple stake positions
   *
   * @param params.stakes Array of stake positions with amount, period, and weightedAmount
   * @param params.sumrPriceUsd Optional SUMR token price in USD (defaults to current price from utils)
   *
   * @returns Earnings estimation including SUMR rewards and USD earnings for each stake
   */
  getStakingEarningsEstimationV2(params: {
    stakes: { weightedAmount: string; id: string }[]
    sumrPriceUsd?: number
  }): Promise<StakingEarningsEstimationForStakesV2>

  /**
   * Returns the staking configuration including the staking contract address
   *
   * @returns Object containing staking configuration
   */
  getStakingConfigV2(): Promise<{ stakingContractAddress: AddressValue }>

  /**
   * Returns staking statistics from the protocol subgraph
   *
   * @returns Object containing staking statistics including total staked, average lockup period, and number of locked stakes
   */
  getStakingStatsV2(): Promise<StakingStatsV2>

  /**
   * Returns the positions that can be migrated
   *
   * @param params.chainInfo Chain information
   * @param params.user The user
   * @param params.migrationType The type of migration
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
   * Returns the APY for the positions that can be migrated
   *
   * @param params.chainInfo Chain information
   * @param params.positionIds The positions to get the APY for
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
   * Returns the transaction for the migration
   *
   * @param params.user The user
   * @param params.vaultId The vault id
   * @param params.shouldStake Should stake
   * @param params.slippage The slippage
   * @param params.positionIds The position IDs to migrate
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
   * Returns the transactions needed to switch from one vault to another
   *
   * @param params.sourceVaultId ID of the source pool
   * @param params.destinationVaultId ID of the destination pool
   * @param params.user Address of the user that is trying to switch
   * @param params.amount Token amount to be switched
   * @param params.slippage Maximum slippage allowed for the operation
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
   * Returns the transactions needed to switch from one vault to another using Enso routing.
   * Source and destination vaults must be on the same chain.
   *
   * @param params.sourceVaultId ID of the source pool
   * @param params.destinationVaultId ID of the destination pool (must be same chain as source)
   * @param params.user Address of the user that is trying to switch
   * @param params.amount Token amount (in source vault's underlying asset) to be switched
   * @param params.slippage Maximum slippage allowed for the operation
   *
   * @returns An array of transactions that must be executed
   */
  getVaultSwitchEnsoTx(params: {
    sourceVaultId: IArmadaVaultId
    destinationVaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
  }): Promise<[VaultSwitchTransactionInfo] | [ApproveTransactionInfo, VaultSwitchTransactionInfo]>

  /**
   * Gets Merkl rewards for a user across specified chains
   *
   * @param params.address The user's address
   * @param params.merklChainId Optional specific Merkl chain ID to get rewards from (if not provided reads from Base chain)
   * @param params.chainIds Optional chain IDs to filter by (default: supported chains)
   * @param params.rewardsTokensAddresses Optional array of token addresses to filter rewards (default: all tokens)
   * @returns Promise<MerklReward[]> Array of Merkl rewards
   */
  getUserMerklRewards(params: {
    address: AddressValue
    merklChainId?: ChainId
    chainIds?: ChainId[]
    rewardsTokensAddresses?: AddressValue[]
  }): Promise<{ perChain: Partial<Record<ChainId, MerklReward[]>> }>

  /**
   * Generates a transaction to claim Merkl rewards for a user on a specific chain
   *
   * @param params.address The user's address
   * @param params.chainId The chain ID to claim rewards on
   * @returns Promise<[MerklClaimTransactionInfo] | undefined> Array containing the claim transaction, or undefined if no rewards to claim
   */
  getUserMerklClaimTx(params: {
    address: AddressValue
    chainId: ChainId
  }): Promise<[MerklClaimTransactionInfo] | undefined>

  /**
   * Generates a transaction to claim Merkl rewards for a referral on a specific chain
   *
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
   * Generates a transaction to claim Merkl rewards for a vault on a specific chain
   *
   * @param params.address The vault's address
   * @param params.chainId The chain ID to claim rewards on
   * @param params.rewardsTokensAddresses Optional array of token addresses to claim (default: all tokens)
   * @returns Promise<[MerklClaimTransactionInfo] | undefined> Array containing the claim transaction, or undefined if no rewards to claim
   */
  getVaultRewardsMerklClaimTx(params: {
    address: AddressValue
    chainId: ChainId
    rewardsTokensAddresses?: AddressValue[]
  }): Promise<[MerklClaimTransactionInfo] | undefined>

  /**
   * Generates a transaction to toggle AdmiralsQuarters as a Merkl rewards operator for a user
   *
   * @param params.chainId The chain ID to perform the operation on
   * @param params.user The user's address
   * @returns Promise<[ToggleAQasMerklRewardsOperatorTransactionInfo]> Array containing the toggle transaction
   */
  getAuthorizeAsMerklRewardsOperatorTx(params: {
    chainId: ChainId
    user: AddressValue
  }): Promise<[ToggleAQasMerklRewardsOperatorTransactionInfo]>

  /**
   * Checks if AdmiralsQuarters is authorized as a Merkl rewards operator for a user
   *
   * @param params.chainId The chain ID to check authorization on
   * @param params.user The user's address
   * @returns Promise<boolean> True if AdmiralsQuarters is authorized as operator, false otherwise
   */
  getIsAuthorizedAsMerklRewardsOperator(params: {
    chainId: ChainId
    user: AddressValue
  }): Promise<boolean>

  /**
   * Generates a transaction to unstake fleet tokens from the rewards manager
   *
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

  /**
   * Generates a transaction to claim staking v2 rewards for a user
   *
   * @param params.user The user to claim rewards for
   * @returns Promise<[ClaimTransactionInfo]> Array containing the claim transaction
   */
  getClaimStakingV2UserRewardsTx(params: { user: IUser }): Promise<[ClaimTransactionInfo]>

  /**
   * Generates a transaction to authorize a caller for staking rewards.
   * When authorizedCaller is omitted, the server defaults to the deployed
   * AdmiralsQuarters address on the hub chain.
   *
   * @param params.user The user who is authorizing
   * @param params.authorizedCaller The address to authorize (optional; defaults to deployed AdmiralsQuarters)
   * @param params.isAuthorized Whether to authorize or revoke authorization
   * @returns Promise<[ClaimTransactionInfo]> Array containing the authorization transaction
   */
  authorizeStakingRewardsCallerV2(params: {
    user: IUser
    authorizedCaller?: IAddress
    isAuthorized: boolean
  }): Promise<[ClaimTransactionInfo]>

  /**
   * Checks if a caller is authorized for staking rewards.
   * When authorizedCaller is omitted, the server defaults to the deployed
   * AdmiralsQuarters address on the hub chain.
   *
   * @param params.owner The owner address
   * @param params.authorizedCaller The address to check authorization for (optional; defaults to deployed AdmiralsQuarters)
   * @returns Promise<boolean> True if the caller is authorized, false otherwise
   */
  isAuthorizedStakingRewardsCallerV2(params: {
    owner: IAddress
    authorizedCaller?: IAddress
  }): Promise<boolean>

  /**
   * Returns the deployed contract addresses for the Armada protocol on a given chain
   *
   * @param params.chainId The chain ID to retrieve addresses for
   * @returns Promise with a record containing the admiralsQuarters contract address
   */
  getProtocolAddresses(params: {
    chainId: ChainId
  }): Promise<Record<'admiralsQuarters', AddressValue>>
}
