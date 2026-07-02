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
  StakingStake,
} from '@summerfi/sdk-common'

/**
 * User staking balance by bucket
 */
export interface StakingBalanceByBucket {
  bucket: StakingBucket
  amount: bigint
}

/**
 * User stake position details (V2)
 */
export interface UserStakingStake {
  id: string
  index: number
  amount: bigint
  weightedAmount: bigint
  lockupEndTime: bigint
  lockupPeriod: bigint
  multiplier: number
}

/**
 * Staking reward rates
 */
export interface StakingRewardRates {
  summerRewardYield: IPercentage
  maxSummerRewardYield: IPercentage
  baseApy: IPercentage
  maxApy: IPercentage
}

/**
 * Staking bucket information
 */
export interface StakingBucketInfo {
  bucket: StakingBucket
  cap: bigint
  totalStaked: bigint
  minLockupPeriod: bigint
  maxLockupPeriod: bigint
}

/**
 * Staking simulation data result
 */
export interface StakingSimulationData {
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
 * Staking stats result from protocol subgraph
 */
export interface StakingStats {
  summerStakedNormalized: string
  amountOfLockedStakes?: bigint | null
  averageLockupPeriod?: bigint | null
  circulatingSupply: string
}

/**
 * Staking earnings estimation for multiple stakes (V2)
 */
export interface StakingEarningsEstimationForStakes {
  stakes: {
    id: string
    sumrRewardsAmount: bigint
    usdEarningsAmount: string
  }[]
}

/**
 * Interface for the Armada Manager Token which handles delegating votes
 */
export interface IArmadaManagerGovernance {
  /**
   * Returns delegatee that the account has chosen
   *
   * @param user The user
   *
   * @returns The delegatee address
   */
  getUserDelegatee: (params: { user: IUser }) => Promise<IAddress>

  /**
   * Returns delegatee selected in the staked SUMR contract (V2)
   *
   * @param userAddress Address whose delegatee should be fetched
   *
   * @returns The delegatee address recorded in the staking contract
   */
  getUserDelegateeV2: (params: { userAddress: AddressValue }) => Promise<IAddress>

  /**
   * Delegates votes from the sender to delegatee
   *
   * @param user The user
   *
   * @returns The transaction information
   */
  getDelegateTx: (params: { user: IUser }) => Promise<[DelegateTransactionInfo]>

  /**
   * Delegates votes for the staked SUMR token (V2)
   *
   * @param delegateeAddress Address that should receive delegated votes
   *
   * @returns The transaction information
   */
  getDelegateTxV2: (params: {
    delegateeAddress: AddressValue
  }) => Promise<[DelegateTransactionInfo]>

  /**
   * Undelegates votes from the sender
   *
   * @returns The transaction information
   */
  getUndelegateTx: () => Promise<[DelegateTransactionInfo]>

  /**
   * Returns the number of votes the user has
   *
   * @param user The user
   *
   * @returns The number of votes
   */
  getUserVotes: (params: { user: IUser }) => Promise<bigint>

  /**
   * Returns the balance of the user
   *
   * @param user The user
   *
   * @returns The balance
   */
  getUserBalance: (params: { user: IUser }) => Promise<bigint>

  /**
   * Returns the staked balance of the user
   *
   * @param user The user
   *
   * @returns The staked balance
   */
  getUserStakedBalance: (params: { user: IUser }) => Promise<bigint>

  /**
   * Returns the rewards the user has earned
   *
   * @param user The user
   *
   * @returns The rewards earned
   */
  getUserEarnedRewards: (params: { user: IUser }) => Promise<bigint>

  /**
   * Returns the transaction to stake tokens
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
   * Returns the transaction to unstake tokens
   *
   * @param amount The amount to unstake
   *
   * @returns The transaction information
   */
  getUnstakeTx: (params: { amount: bigint }) => Promise<[UnstakeTransactionInfo]>

  /**
   * Returns the length of the delegation chain
   *
   * @param user The user
   *
   * @returns The length of the delegation chain
   */
  getDelegationChainLength: (params: { user: IUser }) => Promise<number>

  /**
   * Returns the transaction to stake tokens with lockup (V2)
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
   * Returns the transaction to stake tokens on behalf of another address with lockup (V2)
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
   * Returns the transaction to unstake tokens from a specific stake in the user's portfolio (V2)
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
   * Returns the number of stakes a user has before and after considering a specific bucket
   *
   * @param user The user
   *
   * @returns Object containing userStakesCountBefore and userStakesCountAfter
   */
  getUserStakesCount: (params: {
    user: IUser
  }) => Promise<{ userStakesCountBefore: bigint; userStakesCountAfter: bigint }>

  /**
   * Returns the user's staking balance for each bucket (V2)
   *
   * @param user The user
   *
   * @returns Array of balances by bucket
   */
  getUserStakingBalanceV2: (params: { user: IUser }) => Promise<StakingBalanceByBucket[]>

  /**
   * Returns the user's weighted staking balance for all buckets (V2)
   *
   * @param user The user
   *
   * @returns The weighted balance
   */
  getUserStakingWeightedBalanceV2: (params: { user: IUser }) => Promise<bigint>

  /**
   * Returns the user's earned rewards (V2)
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
   * Returns the staking reward rates including user-specific boost (V2)
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
   * Returns information about all staking buckets (V2)
   *
   * @returns Array of bucket information
   */
  getStakingBucketsInfoV2: () => Promise<StakingBucketInfo[]>

  /**
   * Calculates the weighted stake for a given amount and lockup period (V2)
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
   * Returns the total weighted supply of staked tokens (V2)
   *
   * @returns The total weighted supply
   */
  getStakingTotalWeightedSupplyV2: () => Promise<bigint>

  /**
   * Returns the total SUMR staked across all buckets (V2)
   *
   * @returns The total SUMR staked
   */
  getStakingTotalSumrStakedV2: () => Promise<bigint>

  /**
   * Returns the revenue share percentage for stakers and the calculated amount (V2)
   *
   * @returns Object containing the revenue share percentage and calculated amount in USD
   */
  getStakingRevenueShareV2: () => Promise<{ percentage: IPercentage; amount: number }>

  /**
   * Calculates staking simulation data including yield APYs and boosts
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
  }): Promise<StakingSimulationData>

  /**
   * Calculates staking rewards estimation for multiple stakes
   *
   * @param amounts The amounts to stake
   * @param periods The lockup periods in seconds
   * @param sumrPriceUsd Optional SUMR token price in USD (defaults to current price from utils)
   *
   * @returns Earnings estimation for the provided stakes
   */
  getStakingEarningsEstimationV2(params: {
    stakes: { weightedAmount: string; id: string }[]
    sumrPriceUsd?: number
  }): Promise<StakingEarningsEstimationForStakes>

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
  getStakingStatsV2(): Promise<StakingStats>

  /**
   * Returns the total amount of SUMR tokens staked by the user across all buckets
   *
   * @param user The user to get staking balance for
   *
   * @returns The total SUMR amount staked
   */
  getUserStakingSumrStaked: (params: { user: IUser }) => Promise<bigint>

  /**
   * Returns all staking positions for a user with detailed information
   *
   * @param user The user to get staking positions for
   *
   * @returns Array of user stake positions
   */
  getUserStakesV2: (params: { user: IUser }) => Promise<UserStakingStake[]>

  /**
   * Calculates the penalty percentage for early unstaking of multiple stakes
   *
   * @param userStakes Array of user stake details
   *
   * @returns Array of penalty percentages (IPercentage objects)
   */
  getCalculatePenaltyPercentage: (params: {
    userStakes: { lockupEndTime: number }[]
  }) => Promise<IPercentage[]>

  /**
   * Calculates the penalty amount for early unstaking of specific amounts from multiple stakes
   *
   * @param userStakes Array of user stake details
   * @param amounts Array of amounts to unstake (must match userStakes length)
   *
   * @returns Array of penalty amounts in tokens
   */
  getCalculatePenaltyAmount: (params: {
    userStakes: { lockupEndTime: number }[]
    amounts: bigint[]
  }) => Promise<bigint[]>

  /**
   * Returns the user's current blended yield boost based on their weighted balance and staked balance
   *
   * @param user The user to get the blended yield boost for
   *
   * @returns The user's blended yield boost (userWeightedBalance / userSumrStakedBalance)
   */
  getUserBlendedYieldBoost: (params: { user: IUser }) => Promise<number>

  /**
   * Retrieves all staking stakes across all users with pagination support (V2)
   *
   * @param first number of items to return (optional, defaults to 1000)
   * @param skip number of items to skip for pagination (optional, defaults to 0)
   *
   * @returns Array of StakingStake objects representing the staking stakes, sorted by amount in descending order
   */
  getStakingStakesV2: (params: { first?: number; skip?: number }) => Promise<StakingStake[]>
}
