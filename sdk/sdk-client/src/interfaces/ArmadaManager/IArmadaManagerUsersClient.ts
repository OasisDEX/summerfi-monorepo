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
   * @method getSummerPrice
   * @description Retrieves the current price of the Summer token
   *
   * @param params - Optional parameters
   * @param params.override - Optional price override value
   * @returns The current price of the Summer token
   */
  getSummerPrice(params?: { override?: number }): Promise<{ price: number }>

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
   * @method getProtocolRevenue
   * @description Calculates the total protocol revenue amount in USD across all vaults and chains
   *
   * @returns The revenue amount in USD as a number
   */
  getProtocolRevenue(): Promise<number>

  /**
   * @method getProtocolTvl
   * @description Calculates the total protocol TVL in USD across all vaults and chains
   *
   * @returns The TVL amount in USD as a number
   */
  getProtocolTvl(): Promise<number>

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
   * @method getDeposits
   * @description Get deposits for a given Armada position ID with optional pagination
   *
   * @param positionId Position ID
   * @param first Optional number of items to return
   * @param skip Optional number of items to skip for pagination
   *
   * @returns Array of deposit transactions with amount, timestamp, and vault balance
   */
  getDeposits(params: {
    positionId: IArmadaPositionId
    first?: number
    skip?: number
  }): Promise<IArmadaDeposit[]>

  /**
   * @method getWithdrawals
   * @description Get withdrawals for a given Armada position ID with optional pagination
   *
   * @param positionId Position ID
   * @param first Optional number of items to return
   * @param skip Optional number of items to skip for pagination
   *
   * @returns Array of withdrawal transactions with amount, timestamp, and vault balance
   */
  getWithdrawals(params: {
    positionId: IArmadaPositionId
    first?: number
    skip?: number
  }): Promise<IArmadaWithdrawal[]>

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
   * @method getCrossChainDepositTx
   * @description Returns the transactions needed to deposit tokens cross-chain into a Fleet using Enso routing
   *
   * @param fromChainId Source chain ID where user has tokens
   * @param vaultId ID of the pool to deposit in on destination chain
   * @param user user that is trying to deposit
   * @param amount Token amount to be deposited from source chain
   * @param slippage Maximum slippage allowed for the operation
   * @param referralCode Optional referral code
   *
   * @returns The transactions needed to deposit the tokens cross-chain
   */
  getCrossChainDepositTx(params: {
    fromChainId: ChainId
    vaultId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
    slippage: IPercentage
    referralCode?: string
  }): Promise<[DepositTransactionInfo] | [ApproveTransactionInfo, DepositTransactionInfo]>

  /**
   * @method getCrossChainWithdrawTx
   * @description Returns the transactions needed to withdraw tokens cross-chain from a Fleet using Enso routing
   *
   * @param vaultId ID of the pool to withdraw from
   * @param user user that is trying to withdraw
   * @param amount Token amount to be withdrawn
   * @param slippage Maximum slippage allowed for the operation (in basis points)
   * @param toChainId Destination chain ID where user wants to receive tokens
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
   * @method getUserDelegateeV2
   * @description Returns delegatee configured on the staked SUMR contract (V2)
   *
   * @param userAddress Address whose delegatee should be fetched
   *
   * @returns The delegatee address saved in the staking contract
   */
  getUserDelegateeV2(params: { userAddress: AddressValue }): Promise<IAddress>

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
   * @method getDelegateTxV2
   * @description Delegates votes for the staked SUMR contract (V2)
   *
   * @param delegateeAddress Address that should receive delegated votes
   *
   * @returns The transaction information
   */
  getDelegateTxV2(params: { delegateeAddress: AddressValue }): Promise<[DelegateTransactionInfo]>

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
   * @method getStakeTxV2
   * @description Returns the transaction to stake tokens with lockup (V2)
   *
   * @param user The user
   * @param amount The amount to stake
   * @param lockupPeriod The lockup period in seconds (14 days to 3 years)
   *
   * @returns The transaction information
   */
  getStakeTxV2(params: {
    user: IUser
    amount: bigint
    lockupPeriod: bigint
  }): Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

  /**
   * @method getStakeOnBehalfTxV2
   * @description Returns the transaction to stake tokens on behalf with lockup (V2)
   *
   * @param user The user initiating the stake
   * @param receiver The address receiving the staked tokens
   * @param amount The amount to stake
   * @param lockupPeriod The lockup period in seconds (14 days to 3 years)
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
   * @method getUnstakeTxV2
   * @description Returns the transaction to unstake tokens from a specific stake in the user's portfolio (V2)
   *
   * @param user The user
   * @param userStakeIndex The index of the stake in the user's stake array (portfolio) to unstake from
   * @param amount The amount to unstake
   *
   * @returns The transaction information
   */
  getUnstakeTxV2(params: {
    user: IUser
    userStakeIndex: bigint
    amount: bigint
  }): Promise<[ApproveTransactionInfo, UnstakeTransactionInfo] | [UnstakeTransactionInfo]>

  /**
   * @method getUserStakesCount
   * @description Returns the number of stakes a user has before and after considering a specific bucket
   *
   * @param user The user
   * @param bucketIndex The bucket index to check
   *
   * @returns Object containing userStakesCountBefore and userStakesCountAfter
   */
  getUserStakesCount(params: {
    user: IUser
    bucketIndex: number
  }): Promise<{ userStakesCountBefore: bigint; userStakesCountAfter: bigint }>

  /**
   * @method getUserStakesV2
   * @description Returns all staking positions for a user with detailed information
   *
   * @param user The user to get staking positions for
   *
   * @returns Array of user stake positions
   */
  getUserStakesV2(params: { user: IUser }): Promise<UserStakeV2[]>

  /**
   * @method getCalculatePenaltyPercentage
   * @description Calculates the penalty percentage for early unstaking of multiple stakes
   *
   * @param userStakes Array of user stake details
   *
   * @returns Array of penalty percentages (IPercentage objects)
   */
  getCalculatePenaltyPercentage(params: { userStakes: UserStakeV2[] }): Promise<IPercentage[]>

  /**
   * @method getCalculatePenaltyAmount
   * @description Calculates the penalty amount for early unstaking of specific amounts from multiple stakes
   *
   * @param userStakes Array of user stake details
   * @param amounts Array of amounts to unstake (must match userStakes length)
   *
   * @returns Array of penalty amounts in tokens
   */
  getCalculatePenaltyAmount(params: {
    userStakes: UserStakeV2[]
    amounts: bigint[]
  }): Promise<bigint[]>

  /**
   * @method getUserStakingBalanceV2
   * @description Returns the user's staking balance for each bucket (V2)
   *
   * @param user The user
   *
   * @returns Array of balances by bucket
   */
  getUserStakingBalanceV2(params: { user: IUser }): Promise<UserStakingBalanceByBucket[]>

  /**
   * @method getUserStakingWeightedBalanceV2
   * @description Returns the user's weighted staking balance for all buckets (V2)
   *
   * @param user The user
   *
   * @returns The weighted balance
   */
  getUserStakingWeightedBalanceV2(params: { user: IUser }): Promise<bigint>

  /**
   * @method getUserStakingEarnedV2
   * @description Returns the user's earned rewards (V2)
   *
   * @param user The user
   * @param rewardTokenAddress The reward token address
   *
   * @returns The earned rewards
   */
  getUserStakingEarnedV2(params: { user: IUser; rewardTokenAddress?: IAddress }): Promise<bigint>
  /**
   * @method getUserStakingSumrStaked
   * @description Returns the total amount of SUMR tokens staked by the user across all buckets
   *
   * @param user The user to get staking balance for
   *
   * @returns The total SUMR amount staked
   */
  getUserStakingSumrStaked(params: { user: IUser }): Promise<bigint>

  /**
   * @method getStakingRewardRatesV2
   * @description Returns the staking reward rates including user-specific boost (V2)
   *
   * @param user The user to calculate boosted multiplier for
   * @param rewardTokenAddress Optional reward token address (defaults to SUMR token)
   * @param sumrPriceUsd Optional SUMR price in USD (defaults to current price from utils)
   *
   * @returns Reward rates including APR, APY, and user's boosted multiplier
   */
  getStakingRewardRatesV2(params: {
    rewardTokenAddress?: IAddress
    sumrPriceUsd?: number
  }): Promise<StakingRewardRates>

  /**
   * @method getStakingBucketsInfoV2
   * @description Returns information about all staking buckets (V2)
   *
   * @returns Array of bucket information
   */
  getStakingBucketsInfoV2(): Promise<StakingBucketInfo[]>

  /**
   * @method getStakingCalculateWeightedStakeV2
   * @description Calculates the weighted stake for a given amount and lockup period
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
   * @method getStakingTotalWeightedSupplyV2
   * @description Returns the total weighted supply of staked tokens
   *
   * @returns The total weighted supply as bigint
   */
  getStakingTotalWeightedSupplyV2(): Promise<bigint>

  /**
   * @method getStakingTotalSumrStakedV2
   * @description Returns the total amount of SUMR tokens staked across all buckets
   *
   * @returns The total staked amount as bigint
   */
  getStakingTotalSumrStakedV2(): Promise<bigint>

  /**
   * @method getStakingRevenueShareV2
   * @description Returns the revenue share percentage for stakers and the calculated amount
   *
   * @returns Object containing the revenue share percentage and calculated amount in USD
   */
  getStakingRevenueShareV2(): Promise<{ percentage: IPercentage; amount: number }>

  /**
   * @method getStakingSimulationDataV2
   * @description Calculates staking simulation data including yield APYs and boosts
   *
   * @param amount The amount to stake
   * @param period The lockup period in seconds
   * @param sumrPriceUsd Optional SUMR token price in USD (defaults to current price from utils)
   * @param userAddress The user's wallet address
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
   * @method getStakingEarningsEstimationV2
   * @description Calculates the earnings estimation for multiple stake positions
   *
   * @param stakes Array of stake positions with amount, period, and weightedAmount
   * @param sumrPriceUsd Optional SUMR token price in USD (defaults to current price from utils)
   *
   * @returns Earnings estimation including SUMR rewards and USD earnings for each stake
   */
  getStakingEarningsEstimationV2(params: {
    stakes: { weightedAmount: bigint }[]
    sumrPriceUsd?: number
  }): Promise<StakingEarningsEstimationForStakesV2>

  /**
   * @method getStakingConfigV2
   * @description Returns the staking configuration including the staking contract address
   *
   * @returns Object containing staking configuration
   */
  getStakingConfigV2(): Promise<{ stakingContractAddress: AddressValue }>

  /**
   * @method getStakingStatsV2
   * @description Returns staking statistics from the protocol subgraph
   *
   * @returns Object containing staking statistics including total staked, average lockup period, and number of locked stakes
   */
  getStakingStatsV2(): Promise<StakingStatsV2>

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
