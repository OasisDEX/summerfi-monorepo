import type {
  StakingBucketInfo,
  StakingEarningsEstimationForStakesV2,
  UserStakeV2,
} from '@summerfi/armada-protocol-common'
import type { StakingStake } from '@summerfi/sdk-common'

export type PortfolioSumrStakingV2Data = {
  sumrAvailableToStake: number
  sumrStakedV2: number
  maxApy: number
  stakedSumrRewardApy: number
  maxSumrRewardApy: number
  totalSumrStaked: number
  circulatingSupply: number
  averageLockDuration: number
  userStakes: UserStakeV2[]
  allStakes: StakingStake[]
  bucketInfo: StakingBucketInfo[]
  penaltyPercentages: { value: number; index: number }[]
  penaltyAmounts: { value: number; index: number }[]
  yourEarningsEstimation?: StakingEarningsEstimationForStakesV2
  userBlendedYieldBoost: number
  userUsdcRealYield: number
  usdcEarnedOnSumrAmount: number
}
