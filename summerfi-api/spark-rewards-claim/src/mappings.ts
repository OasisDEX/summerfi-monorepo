import { ClaimType } from './enums'
import type { SparkRewardsClaim } from './types'

export function getClaimType(reward: SparkRewardsClaim) {
  const type = {
    ['pre-farming-and-social']: ClaimType.PRE_FARMING_AND_SOCIAL,
    ['spark-ignition']: ClaimType.SPARK_IGNITION,
  }[reward.type]

  if (!type) {
    throw new Error(`Unknown claim type: ${reward.type}`)
  }
  return type
}

function getRewardsContractAddressByClaimType(claimType: ClaimType): string {
  const contractAddresses = {
    [ClaimType.PRE_FARMING_AND_SOCIAL]: '0x7ac96180c4d6b2a328d3a19ac059d0e7fc3c6d41',
    [ClaimType.SPARK_IGNITION]: '0xCBA0C0a2a0B6Bb11233ec4EA85C5bFfea33e724d',
  }

  return contractAddresses[claimType]
}
