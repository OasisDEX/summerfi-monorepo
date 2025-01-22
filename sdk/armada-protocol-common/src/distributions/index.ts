import type { HexData } from '@summerfi/sdk-common'

// private
interface Distribution {
  chainId: string
  distributionId: string
  merkleRoot: string
  claims: {
    [walletAddress: string]: { amount: string; proof: string[] }
  }
}

const loadDistributions = async (urls: string[]) => {
  try {
    const calls = urls.map((url) => fetch(url).then((res) => res.json()))
    const results = await Promise.all(calls)
    return results as Distribution[]
  } catch (error) {
    throw Error('Failed to load distributions:' + error)
  }
}

// public
export interface Claim {
  index: bigint
  chainId: number
  merkleRoot: string
  amount: bigint
  proof: HexData[]
}
export const getAllMerkleClaims = async (params: {
  walletAddress: string
  distributionsUrls: string[]
}) => {
  const claims: Claim[] = []

  const distributions = await loadDistributions(params.distributionsUrls)

  distributions.forEach((distribution) => {
    const claim = distribution.claims[params.walletAddress]

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
