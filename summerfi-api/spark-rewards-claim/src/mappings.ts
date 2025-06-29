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

export function getRewardsContractAddressByClaimType(claimType: ClaimType, chainId: 1): Hex {
  if (!Object.values(ClaimType).includes(claimType)) {
    throw new Error(`Invalid claim type: ${claimType}`)
  }
  const supportedChainIds = [1] as const
  if (!supportedChainIds.includes(chainId)) {
    throw new Error(
      `Unsupported chain id: ${chainId}. Supported chain ids are: ${supportedChainIds.join(', ')}`,
    )
  }

  const contractAddresses: Record<ClaimType, Record<number, Hex>> = {
    [ClaimType.PRE_FARMING_AND_SOCIAL]: { 1: '0x7ac96180c4d6b2a328d3a19ac059d0e7fc3c6d41' },
    [ClaimType.SPARK_IGNITION]: { 1: '0xCBA0C0a2a0B6Bb11233ec4EA85C5bFfea33e724d' },
  }

  const contractAddressRecord = contractAddresses[claimType]
  if (!contractAddressRecord) {
    throw new Error(`Unknown claim type: ${claimType}, need to add it to the mappings.ts`)
  }

  const address = contractAddressRecord[chainId]
  if (!address) {
    throw new Error(
      `Unknown chain id ${chainId} for claim type ${claimType}, need to add it to mappings.ts`,
    )
  }
  return address
}

export function getRootHashByRewardsContract(contract: string, chainId: 1): Hex {
  const supportedChainIds = [1] as const
  if (!supportedChainIds.includes(chainId)) {
    throw new Error(
      `Unsupported chain id: ${chainId}. Supported chain ids are: ${supportedChainIds.join(', ')}`,
    )
  }

  const rootHashes: Record<string, Record<(typeof supportedChainIds)[number], Hex>> = {
    ['0x7ac96180c4d6b2a328d3a19ac059d0e7fc3c6d41']: {
      1: '0x07868156539f75ed321d1516389731e78b914305f8240c9e08bc473f485a8d53',
    },
    ['0xCBA0C0a2a0B6Bb11233ec4EA85C5bFfea33e724d']: {
      1: '0x0b90e54808c026feb46dabad594c8e2f6625091d82effa5119ea6059dcc5a979',
    },
    ['0x9107f5f940226a9f21433f373a4f938228d20e1a']: {
      1: '0xea342dc91900bfa2a8be6b46145dca41d3c708664bbc38bca223db34f83d9aeb',
    },
  }

  const rootHashRecord = rootHashes[contract]
  if (!rootHashRecord) {
    throw new Error(`Unknown contract: ${contract}, need to add it to the mappings.ts`)
  }

  const rootHash = rootHashRecord[chainId]
  if (!rootHash) {
    throw new Error(
      `Unknown chain id ${chainId} for root hash ${rootHash}, need to add it to mappings.ts`,
    )
  }
  return rootHash
}
