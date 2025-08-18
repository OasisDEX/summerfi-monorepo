/**
 * Represents a single opportunity response
 */

export type MerklOpportunityResponse = {
  rewardsRecord: MerklRewardsRecord
}

/**
 * Array of opportunities responses
 */
export type MerklOpportunitiesResponse = Array<MerklOpportunityResponse>

/**
 * Complete rewards record structure
 */
export interface MerklRewardsRecord {
  /** Unique identifier for the rewards record */
  id: string
  /** Total rewards value */
  total: number
  /** Timestamp when the record was created */
  timestamp: string
  /** Array of individual reward breakdowns */
  breakdowns: MerklRewardsBreakdown[]
}

/**
 * Individual reward breakdown entry
 */
export interface MerklRewardsBreakdown {
  /** Token information for this reward */
  token: MerklRewardsToken
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
export interface MerklRewardsToken {
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

/**
 * Represents a Merkl reward for a user
 */
export interface MerklReward {
  /** The token address for the reward */
  token: {
    chainId: number
    address: string
    symbol: string
    decimals: number
    price: number
  }
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
}
