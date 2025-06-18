import type { Hex } from 'viem'
import type { ClaimType } from './enums'

export type RewardGroup = {
  tag: string
  value: string
}

export type SparkRewardsClaim = {
  type: string
  root_hash: string
  epoch: number
  wallet_address: string
  token_address: string
  amount: string
  amount_normalized: string
  proof: string[]
  restricted_country_codes: string[]
  groups: RewardGroup[]
}

export type SparkRewardsResponse = SparkRewardsClaim[]

export type RewardsData = {
  claimType: ClaimType
  claimArgs: {
    account: Hex
    tokenAddress: Hex
    amount: bigint
    proof: Hex[]
    rootHash: Hex
    epoch: bigint
  }
  error?: string
}
