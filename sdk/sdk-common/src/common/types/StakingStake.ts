import type { AddressValue } from './AddressValue'

/**
 * @description Staking stake details for a user
 */
export interface StakingStake {
  owner: AddressValue
  index: number
  amount: bigint
  weightedAmount: bigint
  weightedAmountNormalized: number
  lockupStartTime: bigint
  lockupEndTime: bigint
  lockupPeriod: bigint
  multiplier: number
}
