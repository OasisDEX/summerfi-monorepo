import { TransactionInfo, type AddressValue } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'

/**
 * @name ISummerStakingContract
 * @description Interface for the SummerStaking contract wrapper
 */
export interface ISummerStakingContract extends IContractWrapper {
  /** WRITE METHODS */

  /**
   * @name stakeLockup
   * @description Stake SUMR tokens with a lockup period
   * @param amount The amount of SUMR to stake
   * @param lockupPeriod The lockup period in seconds
   * @returns The transaction information
   */
  stakeLockup(params: { amount: bigint; lockupPeriod: bigint }): Promise<TransactionInfo>

  /**
   * @name stakeLockupOnBehalf
   * @description Stake SUMR tokens on behalf of another address with a lockup period
   * @param receiver The address to receive the stake
   * @param amount The amount of SUMR to stake
   * @param lockupPeriod The lockup period in seconds
   * @returns The transaction information
   */
  stakeLockupOnBehalf(params: {
    receiver: AddressValue
    amount: bigint
    lockupPeriod: bigint
  }): Promise<TransactionInfo>

  /**
   * @name unstakeLockup
   * @description Unstake SUMR tokens from a lockup position
   * @param stakeIndex The index of the stake to unstake from
   * @param amount The amount to unstake
   * @returns The transaction information
   */
  unstakeLockup(params: { stakeIndex: bigint; amount: bigint }): Promise<TransactionInfo>

  /** ADMIN METHODS */

  /**
   * @name updateLockupBucketCap
   * @description Update the cap for a lockup bucket
   * @param bucket The bucket enum value
   * @param newCap The new cap value
   * @returns The transaction information
   */
  updateLockupBucketCap(params: { bucket: number; newCap: bigint }): Promise<TransactionInfo>

  /**
   * @name updatePenaltyEnabled
   * @description Enable or disable penalty
   * @param penaltyEnabled Boolean to enable or disable penalty
   * @returns The transaction information
   */
  updatePenaltyEnabled(params: { penaltyEnabled: boolean }): Promise<TransactionInfo>

  /**
   * @name rescueToken
   * @description Rescue tokens from the contract
   * @param token The address of the token
   * @param to The address to send rescued tokens to
   * @returns The transaction information
   */
  rescueToken(params: { token: AddressValue; to: AddressValue }): Promise<TransactionInfo>

  /** READ METHODS */

  /**
   * @name getUserStakesCount
   * @description Get the number of stakes for a user
   * @param user The address of the user
   * @returns The number of stakes
   */
  getUserStakesCount(params: { user: AddressValue }): Promise<bigint>

  /**
   * @name getUserStake
   * @description Get details of a user's stake by index
   * @param user The address of the user
   * @param index The index of the stake
   * @returns Tuple: [amount, weightedAmount, lockupEndTime, lockupPeriod]
   */
  getUserStake(params: {
    user: AddressValue
    index: bigint
  }): Promise<readonly [bigint, bigint, bigint, bigint]>

  /**
   * @name weightedBalanceOf
   * @description Get the weighted balance of an account
   * @param account The address of the account
   * @returns The weighted balance
   */
  weightedBalanceOf(params: { account: AddressValue }): Promise<bigint>

  /**
   * @name getBucketTotalStaked
   * @description Get the total staked in a bucket
   * @param bucket The bucket enum value
   * @returns The total staked
   */
  getBucketTotalStaked(params: { bucket: number }): Promise<bigint>

  /**
   * @name getBucketDetails
   * @description Get details for a bucket
   * @param bucket The bucket enum value
   * @returns Tuple: [cap, staked, minLockupPeriod, maxLockupPeriod]
   */
  getBucketDetails(params: { bucket: number }): Promise<readonly [bigint, bigint, bigint, bigint]>

  /**
   * @name getAllBucketInfo
   * @description Get all bucket info
   * @returns Tuple: [buckets, caps, stakedAmounts, minPeriods, maxPeriods]
   */
  getAllBucketInfo(): Promise<readonly [number[], bigint[], bigint[], bigint[], bigint[]]>

  /**
   * @name penaltyEnabled
   * @description Check if early unstake penalties are enabled globally
   * @returns True if penalties are enabled, false otherwise
   */
  penaltyEnabled(): Promise<boolean>

  /**
   * @name calculatePenaltyPercentage
   * @description Calculate penalty percentage for a user's stake
   * @param user The address of the user
   * @param stakeIndex The index of the stake
   * @returns The penalty percentage (wad)
   */
  calculatePenaltyPercentage(params: { user: AddressValue; stakeIndex: bigint }): Promise<bigint>

  /**
   * @name calculatePenalty
   * @description Calculate penalty amount for a user's stake
   * @param user The address of the user
   * @param amount The amount to unstake
   * @param stakeIndex The index of the stake
   * @returns The penalty amount
   */
  calculatePenalty(params: {
    user: AddressValue
    amount: bigint
    stakeIndex: bigint
  }): Promise<bigint>

  /**
   * @name calculateWeightedStake
   * @description Calculate weighted stake for an amount and lockup period
   * @param amount The amount to stake
   * @param lockupPeriod The lockup period in seconds
   * @returns The weighted stake
   */
  calculateWeightedStake(params: { amount: bigint; lockupPeriod: bigint }): Promise<bigint>

  /**
   * @name rewardData
   * @description Get reward data for a specific reward token
   * @param rewardToken The address of the reward token
   * @returns Tuple: [periodFinish, rewardRate, rewardsDuration, lastUpdateTime, rewardPerTokenStored]
   */
  rewardData(params: {
    rewardToken: AddressValue
  }): Promise<readonly [bigint, bigint, bigint, bigint, bigint]>

  /**
   * @name totalSupply
   * @description Get the total weighted supply of staked tokens
   * @returns The total weighted supply
   */
  totalSupply(): Promise<bigint>

  /**
   * @name balanceOf
   * @description Get the raw (unweighted) balance of an account
   * @param account The address of the account
   * @returns The raw balance
   */
  balanceOf(params: { account: AddressValue }): Promise<bigint>

  /**
   * @name stakeSummerTokenAddress
   * @description Get the address of the staked summer token (xSUMR)
   * @returns The address of the staked summer token
   */
  stakeSummerTokenAddress(): Promise<AddressValue>

  /**
   * @name rewards
   * @description Get the rewards amount for a specific account and reward token
   * @param rewardToken The address of the reward token
   * @param account The address of the account
   * @returns The reward amount
   */
  rewards(params: { rewardToken: AddressValue; account: AddressValue }): Promise<bigint>

  /**
   * @name setAuthorization
   * @description Authorize or revoke authorization for a caller to claim rewards on behalf of the user
   * @param authorizedCaller The address to authorize or revoke
   * @param isAuthorized Whether to authorize (true) or revoke (false)
   * @returns The transaction information
   */
  setAuthorization(params: {
    authorizedCaller: AddressValue
    isAuthorized: boolean
  }): Promise<TransactionInfo>

  /**
   * @name isAuthorized
   * @description Check if a caller is authorized to claim rewards on behalf of an owner
   * @param owner The owner address
   * @param authorizedCaller The address to check authorization for
   * @returns True if authorized, false otherwise
   */
  isAuthorized(params: { owner: AddressValue; authorizedCaller: AddressValue }): Promise<boolean>
}
