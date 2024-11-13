import { ChainId, safeParseBigInt } from '@summerfi/serverless-shared'
import {
  UserRewardsResponse,
  UserRewardsDistributionResponse,
  MorphoAggregatedClaims,
  GetClaimsParams,
  MorphoClaims,
  ClaimableMorphoReward,
  MetaMorphoClaims,
  ClaimsRawKeys,
} from './types'

/**
 * Aggregates the `claimable`, `claimed`, and `accrued` fields of an array of `MorphoAggregatedClaims` objects by `rewardTokenAddress`.
 *
 * @param {MorphoAggregatedClaims[]} claims - An array of `MorphoAggregatedClaims` objects to be aggregated.
 * @returns {MorphoAggregatedClaims[]} - An array of `MorphoAggregatedClaims` objects with aggregated values for `claimable`, `claimed`, and `accrued` fields, grouped by `rewardTokenAddress`.
 *
 * @example
 * const claims: MorphoAggregatedClaims[] = [
 *   { rewardTokenAddress: '0xToken1', claimable: BigInt(100), claimed: BigInt(50), accrued: BigInt(150) },
 *   { rewardTokenAddress: '0xToken2', claimable: BigInt(200), claimed: BigInt(100), accrued: BigInt(300) },
 *   { rewardTokenAddress: '0xToken1', claimable: BigInt(50), claimed: BigInt(25), accrued: BigInt(75) }
 * ];
 *
 * const aggregated = aggregateClaimsByToken(claims);
 * console.log(aggregated);
 */
const aggregateClaimsByToken = (claims: MorphoAggregatedClaims[]): MorphoAggregatedClaims[] => {
  const aggregatedClaims: { [key: string]: MorphoAggregatedClaims } = {}

  claims.forEach((claim) => {
    if (!aggregatedClaims[claim.rewardTokenAddress]) {
      aggregatedClaims[claim.rewardTokenAddress] = {
        rewardTokenAddress: claim.rewardTokenAddress,
        claimable: BigInt(0),
        claimed: BigInt(0),
        accrued: BigInt(0),
      }
    }

    aggregatedClaims[claim.rewardTokenAddress].claimable += claim.claimable
    aggregatedClaims[claim.rewardTokenAddress].claimed += claim.claimed
    aggregatedClaims[claim.rewardTokenAddress].accrued += claim.accrued
  })

  return Object.values(aggregatedClaims)
}

export const getClaims = async ({
  account,
  chainId,
  claimType,
  logger,
}: GetClaimsParams): Promise<MorphoClaims> => {
  try {
    if (![ChainId.MAINNET, ChainId.BASE].includes(chainId)) {
      throw new Error(`Not supported chain id ${chainId}. Supported chain ids are: 1, 8453.`)
    }

    const [responseRewards, responseDistribution] = await Promise.all([
      fetch(`https://rewards.morpho.org/v1/users/${account}/rewards?chain_id=${chainId}`),
      fetch(`https://rewards.morpho.org/v1/users/${account}/distributions?chain_id=${chainId}`),
    ])

    if (responseRewards.status !== 200 || responseDistribution.status !== 200) {
      logger?.warn('Failed to fetch data from morpho rewards endpointa', {
        error: responseRewards.statusText,
      })
    }

    const userRewardsResponse = (await responseRewards.json()) as UserRewardsResponse

    const userRewardsDistribution =
      (await responseDistribution.json()) as UserRewardsDistributionResponse

    const claimable: ClaimableMorphoReward[] = userRewardsDistribution.data.map((item) => {
      return {
        rewardTokenAddress: item.asset.address,
        urd: item.distributor.address,
        claimable: BigInt(item.claimable),
        proof: item.proof,
      }
    })

    const resolvedClaimType = {
      [MetaMorphoClaims.BORROW]: ClaimsRawKeys.FOR_BORROW,
      [MetaMorphoClaims.SUPPLY]: ClaimsRawKeys.FOR_SUPPLY,
    }[claimType]

    const claimsAggregated: MorphoAggregatedClaims[] = aggregateClaimsByToken(
      userRewardsResponse.data
        .map((item) => {
          if (item.asset.address.toLowerCase() === '0x039b598c6b99e70058e1e9021e000bdacd33d026') {
            return null
          }

          const rewards = item[resolvedClaimType]

          if (rewards) {
            return {
              rewardTokenAddress: item.asset.address,
              claimable: safeParseBigInt(rewards.claimable_now) || 0n,
              accrued: safeParseBigInt(rewards.total) || 0n,
              claimed: safeParseBigInt(rewards.claimed) || 0n,
            }
          }

          if (item.amount) {
            return {
              rewardTokenAddress: item.asset.address,
              claimable: safeParseBigInt(item.amount.claimable_now) || 0n,
              accrued: safeParseBigInt(item.amount.total) || 0n,
              claimed: safeParseBigInt(item.amount.claimed) || 0n,
            }
          }

          return null
        })
        .filter((item) => !!item) as MorphoAggregatedClaims[],
    )

    return {
      claimable, // IMPORTANT - claimable are user specific, not claimType or even position specific
      claimsAggregated,
    }
  } catch (error) {
    console.error('Get morpho reward claims failed', error)
    return {
      claimable: [],
      claimsAggregated: [],
      error: `Get morpho reward claims failed. ${error}`,
    }
  }
}
