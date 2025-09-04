/**
 * Response type from Merkl API for users rewards
 */

export type MerklApiUsersResponse = MerklApiUser[]

export type MerklApiUser = {
  chain: MerklApiChain
  rewards: MerklApiReward[]
}

/**
 * Response type from Merkl API for opportunities
 */
export type MerklApiOpportunitiesResponse = MerklApiOpportunity[]

export type MerklApiOpportunity = {
  chainId: number
  type: string
  identifier: string
  status: 'LIVE' | 'PAST'
  dailyRewards: number
  chain: MerklApiChain
  rewardsRecord: MerklApiOpportunityRewardsRecord
}

/**
 * Complete rewards record structure
 */
export interface MerklApiOpportunityRewardsRecord {
  /** Unique identifier for the rewards record */
  id: string
  /** Total rewards value */
  total: number
  /** Timestamp when the record was created */
  timestamp: string
  /** Array of individual reward breakdowns */
  breakdowns: MerklApiOpportunityRewardsRecordBreakdown[]
}

/**
 * Individual reward breakdown entry
 */
export interface MerklApiOpportunityRewardsRecordBreakdown {
  /** Token information for this reward */
  token: MerklApiOpportunityRewardsRecordBreakdownToken
  /** Amount of tokens as string (to handle large numbers) */
  amount: string
  /** USD value of the reward amount */
  value: number
  /** Type of distribution mechanism */
  distributionType: string
  /** Unique identifier for this breakdown */
  id: string
  /** Timestamp when this reward was recorded */
  timestamp: string
  /** ID of the campaign this reward belongs to */
  campaignId: string
  /** ID of the daily rewards record this belongs to */
  dailyRewardsRecordId: string
}

/**
 * Token information for rewards
 */
export interface MerklApiOpportunityRewardsRecordBreakdownToken {
  /** Unique identifier for the token */
  id: string
  /** Human-readable name of the token */
  name: string
  /** Chain ID where the token exists */
  chainId: number
  /** Contract address of the token */
  address: string
  /** Number of decimal places for the token */
  decimals: number
  /** Token symbol (e.g., "SUMR") */
  symbol: string
  /** Display symbol for UI purposes */
  displaySymbol: string
  /** URL to the token's icon image */
  icon: string
  /** Whether the token is verified */
  verified: boolean
  /** Whether this is a test token */
  isTest: boolean
  /** Token type classification */
  type: string
  /** Whether this is a native blockchain token */
  isNative: boolean
  /** Current price of the token (can be null) */
  price: number | null
}

export interface MerklApiChain {
  id: number
  name: string
  icon: string
  liveCampaigns: number
}

export interface MerklApiReward {
  root: string
  recipient: string
  amount: string
  claimed: string
  pending: string
  proofs: string[]
  token: MerklApiToken
  breakdowns: MerklApiRewardBreakdown[]
}

export type MerklApiToken = {
  address: string
  chainId: number
  symbol: string
  decimals: number
  price: number
}

export interface MerklApiRewardBreakdown {
  reason: string
  amount: string
  claimed: string
  pending: string
  campaignId: string
  subCampaignId?: string
}

/**
 * Represents a Merkl reward for a user
 */
export interface MerklReward {
  /** The token address for the reward */
  token: MerklApiToken
  /** The merkle root for the reward */
  root: string
  /** The recipient address */
  recipient: string
  /** The reward amount */
  amount: string
  /** The claimed amount */
  claimed: string
  /** The pending amount */
  pending: string
  /** The merkle proofs for claiming */
  proofs: string[]
  /** Breakdown of the reward into components */
  breakdowns: MerklApiRewardBreakdown[]
}
