import type {
  ApproveTransactionInfo,
  DelegateTransactionInfo,
  IAddress,
  IUser,
  IPercentage,
  StakeTransactionInfo,
  StakingBucket,
  UnstakeTransactionInfo,
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
  summerRewardAPY: number
  usdcYieldAPY: number
  boostedMultiplier: number
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
   * @method getDelegateTx
   * @description Delegates votes from the sender to delegatee
   *
   * @param user The user
   *
   * @returns The transaction information
   */
  getDelegateTx: (params: { user: IUser }) => Promise<[DelegateTransactionInfo]>

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
   * @param userStakeIndex The index of the stake in the user's stake array (portfolio) to unstake from
   * @param amount The amount to unstake
   *
   * @returns The transaction information
   */
  getUnstakeTxV2: (params: {
    userStakeIndex: bigint
    amount: bigint
  }) => Promise<[UnstakeTransactionInfo]>

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
   * @param rewardTokenAddress The reward token address
   *
   * @returns The earned rewards
   */
  getUserStakingEarnedV2: (params: { user: IUser; rewardTokenAddress: IAddress }) => Promise<bigint>

  /**
   * @method getStakingRewardRatesV2
   * @description Returns the staking reward rates including user-specific boost (V2)
   *
   * @param user The user to calculate boosted multiplier for
   * @param rewardTokenAddress The reward token address
   *
   * @returns Reward rates including APR, APY, and user's boosted multiplier
   */
  getStakingRewardRatesV2: (params: {
    user: IUser
    rewardTokenAddress: IAddress
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
   * @description Returns the revenue share percentage for stakers (V2)
   *
   * @returns The revenue share as a percentage
   */
  getStakingRevenueShareV2: () => Promise<IPercentage>

  /**
   * @method getStakingRevenueAmountV2
   * @description Calculates the total revenue amount for stakers in USD (V2)
   *
   * @returns The revenue amount in USD as a number
   */
  getStakingRevenueAmountV2: () => Promise<number>
}
