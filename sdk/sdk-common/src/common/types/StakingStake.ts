import type { AddressValue } from './AddressValue'

/**
 * @description Staking stake position details
 */
export interface StakingStake {
  id: string
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
