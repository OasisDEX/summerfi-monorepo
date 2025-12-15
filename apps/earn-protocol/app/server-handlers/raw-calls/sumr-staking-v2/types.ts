import type {
  StakingBucketInfo,
  StakingEarningsEstimationForStakesV2,
  UserStakeV2,
} from '@summerfi/armada-protocol-common'
import type { StakingStake } from '@summerfi/sdk-common'

type RecursiveObjectWithNumberInsteadOfBigInt<T> = {
  [K in keyof T]: T[K] extends bigint
    ? number
    : T[K] extends object
      ? RecursiveObjectWithNumberInsteadOfBigInt<T[K]>
      : T[K]
}

export type PortfolioSumrStakingV2Data = {
  sumrAvailableToStake: number
  sumrStakedV2: number
  maxApy: number
  stakedSumrRewardApy: number
  maxSumrRewardApy: number
  totalSumrStaked: number
  circulatingSupply: number
  averageLockDuration: number
  userStakes: RecursiveObjectWithNumberInsteadOfBigInt<UserStakeV2[]>
  allStakes: RecursiveObjectWithNumberInsteadOfBigInt<StakingStake[]>
  bucketInfo: RecursiveObjectWithNumberInsteadOfBigInt<StakingBucketInfo[]>
  penaltyPercentages: { value: number; index: number }[]
  penaltyAmounts: { value: number; index: number }[]
  yourEarningsEstimation?: RecursiveObjectWithNumberInsteadOfBigInt<StakingEarningsEstimationForStakesV2>
  userBlendedYieldBoost: number
  userUsdcRealYield: number
  usdcEarnedOnSumrAmount: number
}
