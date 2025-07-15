import type { Hex } from 'viem'
import { ClaimType } from './enums'
import type { SparkRewardsClaim } from './types'
import { supportedChainIds, type SupportedChainIds } from './supportedChainIds'

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

export function getRewardsContractAddressByClaimType(
  claimType: ClaimType,
  chainId: SupportedChainIds,
): Hex {
  if (!Object.values(ClaimType).includes(claimType)) {
    throw new Error(`Invalid claim type: ${claimType}`)
  }
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

export function assertValidRootHash(rootHash: Hex, chainId: SupportedChainIds): void {
  const validRootHashListPerChain = {
    1: [
      '0x07868156539f75ed321d1516389731e78b914305f8240c9e08bc473f485a8d53',
      '0x0b90e54808c026feb46dabad594c8e2f6625091d82effa5119ea6059dcc5a979',
      '0xea342dc91900bfa2a8be6b46145dca41d3c708664bbc38bca223db34f83d9aeb',
    ],
  }

  // validate chainid
  if (!Object.keys(validRootHashListPerChain).includes(chainId.toString())) {
    throw new Error(
      `Unsupported chain id: ${chainId}. Supported chain ids are: ${Object.keys(validRootHashListPerChain).join(', ')}`,
    )
  }

  if (!validRootHashListPerChain[chainId].includes(rootHash)) {
    throw new Error(`Unknown rootHash: ${rootHash}, need to add it to the mappings.ts`)
  }
}
