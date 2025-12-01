import type {
  ApproveTransactionInfo,
  DelegateTransactionInfo,
  IAddress,
  IUser,
  IPercentage,
  StakeTransactionInfo,
  StakingBucket,
  UnstakeTransactionInfo,
  AddressValue,
} from '@summerfi/sdk-common'

/**
 * @description User staking balance by bucket
 */
export interface UserStakingBalanceByBucket {
  bucket: StakingBucket
  amount: bigint
}

/**
 * @description Staking reward rates
 */
export interface StakingRewardRates {
  summerRewardApy: IPercentage
  baseApy: IPercentage
  maxApy: IPercentage
}

/**
 * @description Staking bucket information
 */
export interface StakingBucketInfo {
  bucket: StakingBucket
  cap: bigint
  totalStaked: bigint
  minLockupPeriod: bigint
  maxLockupPeriod: bigint
}

/**
 * @description Staking simulation data result
 */
export interface StakingSimulationDataV2 {
  sumrRewardApy: IPercentage
  usdcYieldApy: IPercentage
  usdcYieldBoost: number
  usdcBlendedYieldBoostFrom: number
  usdcBlendedYieldBoostTo: number
  weightedAmount: bigint
  userStakesCountBefore: bigint
  userStakesCountAfter: bigint
}

/**
 * @description Staking stats result from protocol subgraph
 */
export interface StakingStatsV2 {
  summerStakedNormalized: string
  amountOfLockedStakes?: bigint | null
  averageLockupPeriod?: bigint | null
  circulatingSupply: string
}

/**
 * @name IArmadaManagerGovernance
 * @description Interface for the Armada Manager Token which handles delegating votes
 *
 */
export interface IArmadaManagerGovernance {
  /**
   * @method getUserDelegatee
   * @description Returns delegatee that the account has chosen
   *
   * @param user The user
   *
   * @returns The delegatee address
   */
  getUserDelegatee: (params: { user: IUser }) => Promise<IAddress>

  /**
   * @method getUserDelegateeV2
   * @description Returns delegatee selected in the staked SUMR contract (V2)
   *
   * @param userAddress Address whose delegatee should be fetched
   *
   * @returns The delegatee address recorded in the staking contract
   */
  getUserDelegateeV2: (params: { userAddress: AddressValue }) => Promise<IAddress>

  /**
   * @method getDelegateTx
   * @description Delegates votes from the sender to delegatee
   *
   * @param user The user
   *
   * @returns The transaction information
   */
  getDelegateTx: (params: { user: IUser }) => Promise<[DelegateTransactionInfo]>

  /**
   * @method getDelegateTxV2
   * @description Delegates votes for the staked SUMR token (V2)
   *
   * @param delegateeAddress Address that should receive delegated votes
   *
   * @returns The transaction information
   */
  getDelegateTxV2: (params: {
    delegateeAddress: AddressValue
  }) => Promise<[DelegateTransactionInfo]>

  /**
   * @method getUndelegateTx
   * @description Undelegates votes from the sender
   *
   * @returns The transaction information
   */
  getUndelegateTx: () => Promise<[DelegateTransactionInfo]>

  /**
   * @method getUserVotes
   * @description Returns the number of votes the user has
   *
   * @param user The user
   *
   * @returns The number of votes
   */
  getUserVotes: (params: { user: IUser }) => Promise<bigint>

  /**
   * @method getUserBalance
   * @description Returns the balance of the user
   *
   * @param user The user
   *
   * @returns The balance
   */
  getUserBalance: (params: { user: IUser }) => Promise<bigint>

  /**
   * @method getUserStakedBalance
   * @description Returns the staked balance of the user
   *
   * @param user The user
   *
   * @returns The staked balance
   */
  getUserStakedBalance: (params: { user: IUser }) => Promise<bigint>

  /**
   * @method getUserEarnedRewards
   * @description Returns the rewards the user has earned
   *
   * @param user The user
   *
   * @returns The rewards earned
   */
  getUserEarnedRewards: (params: { user: IUser }) => Promise<bigint>

  /**
   * @method getStakeTx
   * @description Returns the transaction to stake tokens
   *
   * @param user The user
   * @param amount The amount to stake
   *
   * @returns The transaction information
   */
  getStakeTx: (params: {
    user: IUser
    amount: bigint
  }) => Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

  /**
   * @method getUnstakeTx
   * @description Returns the transaction to unstake tokens
   *
   * @param amount The amount to unstake
   *
   * @returns The transaction information
   */
  getUnstakeTx: (params: { amount: bigint }) => Promise<[UnstakeTransactionInfo]>

  /**
   * @method getDelegationChainLength
   * @description Returns the length of the delegation chain
   *
   * @param user The user
   *
   * @returns The length of the delegation chain
   */
  getDelegationChainLength: (params: { user: IUser }) => Promise<number>

  /**
   * @method getStakeTxV2
   * @description Returns the transaction to stake tokens with lockup (V2)
   *
   * @param user The user
   * @param amount The amount to stake
   * @param lockupPeriod The lockup period in seconds (14 days to 3 years with 1 second resolution)
   *
   * @returns The transaction information
   */
  getStakeTxV2: (params: {
    user: IUser
    amount: bigint
    lockupPeriod: bigint
  }) => Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

  /**
   * @method getStakeOnBehalfTxV2
   * @description Returns the transaction to stake tokens on behalf of another address with lockup (V2)
   *
   * @param user The user initiating the stake
   * @param receiver The address receiving the staked tokens
   * @param amount The amount to stake
   * @param lockupPeriod The lockup period in seconds (14 days to 3 years with 1 second resolution)
   *
   * @returns The transaction information
   */
  getStakeOnBehalfTxV2: (params: {
    user: IUser
    receiver: IAddress
    amount: bigint
    lockupPeriod: bigint
  }) => Promise<[ApproveTransactionInfo, StakeTransactionInfo] | [StakeTransactionInfo]>

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
  getUnstakeTxV2: (params: {
    user: IUser
    userStakeIndex: bigint
    amount: bigint
  }) => Promise<[ApproveTransactionInfo, UnstakeTransactionInfo] | [UnstakeTransactionInfo]>

  /**
   * @method getUserStakesCount
   * @description Returns the number of stakes a user has before and after considering a specific bucket
   *
   * @param user The user
   * @param bucketIndex The bucket index to check
   *
   * @returns Object containing userStakesCountBefore and userStakesCountAfter
   */
  getUserStakesCount: (params: {
    user: IUser
    bucketIndex: number
  }) => Promise<{ userStakesCountBefore: bigint; userStakesCountAfter: bigint }>

  /**
   * @method getUserStakingBalanceV2
   * @description Returns the user's staking balance for each bucket (V2)
   *
   * @param user The user
   *
   * @returns Array of balances by bucket
   */
  getUserStakingBalanceV2: (params: { user: IUser }) => Promise<UserStakingBalanceByBucket[]>

  /**
   * @method getUserStakingWeightedBalanceV2
   * @description Returns the user's weighted staking balance for all buckets (V2)
   *
   * @param user The user
   *
   * @returns The weighted balance
   */
  getUserStakingWeightedBalanceV2: (params: { user: IUser }) => Promise<bigint>

  /**
   * @method getUserStakingEarnedV2
   * @description Returns the user's earned rewards (V2)
   *
   * @param user The user
   * @param rewardTokenAddress The reward token address optional parameter (defaults to SUMR token)
   *
   * @returns The earned rewards
   */
  getUserStakingEarnedV2: (params: {
    user: IUser
    rewardTokenAddress?: IAddress
  }) => Promise<bigint>

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
  getStakingRewardRatesV2: (params: {
    rewardTokenAddress?: IAddress
    sumrPriceUsd?: number
  }) => Promise<StakingRewardRates>

  /**
   * @method getStakingBucketsInfoV2
   * @description Returns information about all staking buckets (V2)
   *
   * @returns Array of bucket information
   */
  getStakingBucketsInfoV2: () => Promise<StakingBucketInfo[]>

  /**
   * @method getStakingCalculateWeightedStakeV2
   * @description Calculates the weighted stake for a given amount and lockup period (V2)
   *
   * @param amount The amount to stake
   * @param lockupPeriod The lockup period in seconds
   *
   * @returns The calculated weighted stake
   */
  getStakingCalculateWeightedStakeV2: (params: {
    amount: bigint
    lockupPeriod: bigint
  }) => Promise<bigint>

  /**
   * @method getStakingTotalWeightedSupplyV2
   * @description Returns the total weighted supply of staked tokens (V2)
   *
   * @returns The total weighted supply
   */
  getStakingTotalWeightedSupplyV2: () => Promise<bigint>

  /**
   * @method getStakingTotalSumrStakedV2
   * @description Returns the total SUMR staked across all buckets (V2)
   *
   * @returns The total SUMR staked
   */
  getStakingTotalSumrStakedV2: () => Promise<bigint>

  /**
   * @method getStakingRevenueShareV2
   * @description Returns the revenue share percentage for stakers and the calculated amount (V2)
   *
   * @returns Object containing the revenue share percentage and calculated amount in USD
   */
  getStakingRevenueShareV2: () => Promise<{ percentage: IPercentage; amount: number }>

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
   * @method getUserStakingSumrStaked
   * @description Returns the total amount of SUMR tokens staked by the user across all buckets
   *
   * @param user The user to get staking balance for
   *
   * @returns The total SUMR amount staked
   */
  getUserStakingSumrStaked: (params: { user: IUser }) => Promise<bigint>
}
