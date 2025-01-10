import type { HexData } from '@summerfi/sdk-common'
import distribution1 from './distribution-1.json'
import distribution2 from './distribution-2.json'

// private
interface Distribution {
  chainId: string
  distributionId: string
  merkleRoot: string
  claims: {
    [walletAddress: string]: { amount: string; proof: string[] }
  }
}
const distributions: Distribution[] = [distribution1, distribution2]

// public
export interface Claim {
  index: bigint
  chainId: number
  merkleRoot: string
  amount: bigint
  proof: HexData[]
}
export const getClaims = (walletAddress: string) => {
  const claims: Claim[] = []

  distributions.forEach((distribution) => {
    const claim = distribution.claims[walletAddress]

    if (claim !== undefined) {
      claims.push({
        index: BigInt(distribution.distributionId),
        chainId: Number(distribution.chainId),
        merkleRoot: distribution.merkleRoot,
        amount: BigInt(claim.amount),
        proof: claim.proof as HexData[],
      })
    }
  })

  return claims
}

export const getClaim = (walletAddress: string, index: string) => {
  const distribution = distributions.find((distribution) => {
    return distribution.distributionId === index
  })

  if (distribution !== undefined) {
    const claim = distribution.claims[walletAddress]

    if (claim !== undefined) {
      return {
        index: BigInt(index),
        chainId: Number(distribution.chainId),
        merkleRoot: distribution.merkleRoot,
        amount: BigInt(claim.amount),
        proof: claim.proof as HexData[],
      }
    }
  }

  return null
}
