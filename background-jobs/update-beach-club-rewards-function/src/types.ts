// We'll define Network enum here since we can't import it directly
export enum Network {
  MAINNET = 'mainnet',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
  BASE = 'base',
  SEPOLIA = 'sepolia',
  SONIC = 'sonic',
}

// Only include the chains we have subgraph URLs for
export const SUPPORTED_CHAINS = [
  Network.MAINNET,
  Network.ARBITRUM,
  Network.BASE,
  Network.SONIC,
] as const
export type SupportedChain = (typeof SUPPORTED_CHAINS)[number]

export interface ReferralData {
  id: string
  amountOfReferred?: string
  protocol?: string
}

export interface HourlySnapshot {
  id: string
  timestamp: string
  inputTokenBalanceNormalizedInUSD: string
  inputTokenBalanceNormalized: string
  stakedInputTokenBalanceNormalizedInUSD?: string
  unstakedInputTokenBalanceNormalizedInUSD?: string
}

export interface Position {
  id: string
  account?: {
    id: string
  }
  vault: {
    id: string
    inputToken: {
      symbol: string
    }
  }
  inputTokenBalanceNormalizedInUSD: string
  inputTokenBalanceNormalized: string
  createdTimestamp: string
  createdBlockNumber?: string
  referralData?: ReferralData
  hourlySnapshots?: HourlySnapshot[]
}

export interface Account {
  id: string
  lastUpdateBlock?: string
  referralData?: ReferralData
  referralTimestamp?: string
  positions?: Position[]
  referralChain?: SupportedChain
}

export function convertAccount(account: any): Account {
  return {
    id: account.id,
    lastUpdateBlock: account.lastUpdateBlock,
    referralData: account.referralData,
    referralTimestamp: account.referralTimestamp,
    positions: account.positions?.map((p: any) => convertPosition(p)),
  }
}

export function convertPosition(position: any): Position {
  return {
    id: position.id,
    account: position.account,
    vault: position.vault,
    inputTokenBalanceNormalized: position.inputTokenBalanceNormalized,
    inputTokenBalanceNormalizedInUSD: position.inputTokenBalanceNormalizedInUSD,
    createdTimestamp: position.createdTimestamp,
    referralData: position.referralData,
    hourlySnapshots: position.hourlySnapshots?.map((s: any) => convertHourlySnapshot(s)),
  }
}

export function convertHourlySnapshot(snapshot: any): HourlySnapshot {
  return {
    id: snapshot.id,
    timestamp: snapshot.timestamp,
    inputTokenBalanceNormalizedInUSD: snapshot.inputTokenBalanceNormalizedInUSD,
    inputTokenBalanceNormalized: snapshot.inputTokenBalanceNormalized,
  }
}

export type PositionUpdate = {
  id: string
  chain: string
  user_id: string
  current_deposit_usd: string
  current_deposit_asset: string
  currency_symbol: string
  fees_per_day_referrer: string
  fees_per_day_owner: string
  fees_per_day_referrer_usd: string
  fees_per_day_owner_usd: string
  is_volatile: boolean
  last_synced_at: Date
}

export interface SimplifiedReferralCode {
  id: string
  custom_code: string | null
  total_deposits_referred_usd: number
  active_users_count: number
  last_calculated_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface RewardsBalance {
  id: number
  referral_code_id: string
  currency: string
  balance: number
  balance_usd: number | null
  amount_per_day: number
  amount_per_day_usd: number | null
  total_earned: number
  total_claimed: number
  created_at: Date | null
  updated_at: Date | null
}

export interface SimplifiedUser {
  id: string
  referrer_id: string | null
  referral_chain: string | null
  referral_timestamp: Date | null
  total_deposits_referred_usd: number
  is_active: boolean
  last_activity_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface SimplifiedPosition {
  id: string
  chain: string
  user_id: string
  current_deposit_usd: number
  current_deposit_asset: number
  currency_symbol: string
  last_synced_at: Date | null
}
export enum ReferralCodeType {
  USER = 'user',
  INTEGRATOR = 'integrator',
  INVALID = 'invalid',
  TEST = 'test',
}

export enum AssetVolatility {
  VOLATILE = 'volatile',
  STABLE = 'stable',
}

export enum RewardDescription {
  REGULAR = 'regular_distribution',
  BONUS = 'bonus',
  CLAIM = 'claim',
}

export enum RewardCurrency {
  POINTS = 'points',
  SUMR = 'SUMR',
}
