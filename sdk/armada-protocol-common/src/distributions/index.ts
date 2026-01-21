import type { HexData } from '@summerfi/sdk-common'

// private
interface Distribution {
  chainId: string
  distributionId: string
  merkleRoot: string
  contractAddress: HexData
  claims: {
    [walletAddress: string]: { amount: string; proof: string[] }
  }
}

const loadDistributions = async (urls: string[]) => {
  try {
    const calls = urls.map((url) => {
      return fetch(url).then((res) => {
        return res.json().catch((error) => {
          throw new Error('Failed to load distribution: ' + url + '\n' + error)
        })
      })
    })
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
  contractAddress: HexData
}
export const getAllDistributionClaims = async (params: {
  walletAddress: string
  distributionsUrls: string[]
}) => {
  const distributions = await loadDistributions(params.distributionsUrls)

  const claims: Claim[] = []
  distributions.forEach((distribution) => {
    const claim = distribution.claims[params.walletAddress.toLowerCase()]

    if (claim !== undefined) {
      claims.push({
        index: BigInt(distribution.distributionId),
        chainId: Number(distribution.chainId),
        merkleRoot: distribution.merkleRoot,
        amount: BigInt(claim.amount),
        proof: claim.proof as HexData[],
        contractAddress: distribution.contractAddress,
      })
    }
  })

  return claims
}
