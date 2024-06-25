import { Address } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'

export interface GetClaimsParams {
  account: Address
  logger?: Logger
}
type Proof = Array<`0x${string}`>

export interface MorphoReward {
  urd: Address
  rewardTokenAddress: string
}
export interface ClaimableMorphoReward extends MorphoReward {
  claimable: bigint
  proof: Proof
}
export interface MorphoAggregatedClaims {
  rewardTokenAddress: string
  claimable: bigint
  claimed: bigint
  accrued: bigint
}

export interface MorphoClaims {
  claimable: ClaimableMorphoReward[]
  claimsAggregated: MorphoAggregatedClaims[]
}

type Identity = {
  id: string
  address: Address
  chain_id: number
}

type UserRewardsDistribution = {
  user: Address
  asset: Identity
  distributor: Identity
  claimable: string
  proof: Proof
  tx_data: string
}

export type UserRewardsDistributionResponse = {
  data: UserRewardsDistribution[]
}

type ForRewards = {
  total: string
  claimable_now: string
  claimable_next: string
  claimed: string
}

type Program = {
  id: string
  creator: Address
  start: string
  end: string
  created_at: string
  blacklist: unknown[]
  type: 'market-reward'
  distributor: Identity
  asset: Identity
  market_id: string
  supply_rate_per_year: string
  borrow_rate_per_year: string
  collateral_rate_per_year: string
  chain_id: number
  reallocated_from: string
}

type UserRewards = {
  user: Address
  type: 'market-reward'
  program: Program
  for_supply: ForRewards | null
  for_borrow: ForRewards | null
  for_collateral: ForRewards | null
}

export type UserRewardsResponse = {
  data: UserRewards[]
}
