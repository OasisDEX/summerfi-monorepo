import type { Hex } from 'viem'
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

export function getRewardsContractAddressByClaimType(claimType: ClaimType, chainId: number): Hex {
  if (!Object.values(ClaimType).includes(claimType)) {
    throw new Error(`Invalid claim type: ${claimType}`)
  }
  if (![1].includes(chainId)) {
    throw new Error(`Unsupported chain id: ${chainId}. Supported chain ids are: 1`)
  }

  const contractAddresses: Record<ClaimType, Record<number, Hex>> = {
    [ClaimType.PRE_FARMING_AND_SOCIAL]: { 1: '0x7ac96180c4d6b2a328d3a19ac059d0e7fc3c6d41' },
    [ClaimType.SPARK_IGNITION]: { 1: '0xCBA0C0a2a0B6Bb11233ec4EA85C5bFfea33e724d' },
  }

  const address = contractAddresses[claimType][chainId]
  if (!address) {
    throw new Error(`Unknown contract address for claim type ${claimType} and chain id ${chainId}`)
  }
  return address
}
