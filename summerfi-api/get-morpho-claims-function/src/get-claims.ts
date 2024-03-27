import { Address, IRpcConfig, safeParseBigInt } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'

type Token = {
  address: Address
  decimals: number
  symbol: string
  name: string
  price?: string
}
type Args = {
  address: string
  token: string
  amount: string
  proof: string[]
}

type TokenInfo = {
  token: Token
  accrued: string
  available: string
  claimable: string
  claimed: string
  function_signature: string
  args?: Args
}

type Reward = {
  rewards_distributor: string
  root: string
  tokens: TokenInfo[]
}

type UserRewards = {
  user: string
  timestamp: number
  rewards: Reward[]
}

type Proof = Array<`0x${string}`>

export const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'summerfi-api',
}

export interface GetClaimsParams {
  account: Address
  logger?: Logger
}

export interface MorphoReward {
  urd: Address
  reward: Token
  rewardSymbol: string
  amount: bigint
}
export interface ClaimableMorphoReward extends MorphoReward {
  claimable: bigint
  proof: Proof
}
export interface MorphoAggregatedClaims {
  rewardToken: {
    address: Address
    symbol: string
    decimals: number
  }
  claimable: bigint
  claimed: bigint
  accrued: bigint
  total: bigint
}

export interface MorphoClaims {
  claimable: ClaimableMorphoReward[]
  claimed: MorphoReward[]
  accrued: MorphoReward[]
  claimsAggregated: MorphoAggregatedClaims[]
}

export const getClaims = async ({ account, logger }: GetClaimsParams): Promise<MorphoClaims> => {
  try {
    const response = await fetch(`https://rewards.morpho.org/users/${account}/rewards`)
    if (response.status !== 200) {
      logger?.warn('Failed to fetch data from morpho rewards endpointa', {
        error: response.statusText,
      })
    }
    const data = (await response.json()) as UserRewards

    const claimed: MorphoReward[] = []

    data.rewards.forEach((reward) => {
      reward.tokens.forEach((token) => {
        if (token.claimed !== '0') {
          claimed.push({
            urd: reward.rewards_distributor as Address,
            reward: {
              address: token.token.address,
              decimals: token.token.decimals,
              symbol: token.token.symbol,
              name: token.token.name,
            },
            rewardSymbol: token.token.symbol,
            amount: safeParseBigInt(token.claimed) ? BigInt(token.claimed) : 0n,
          })
        }
      })
    })

    const claimable: ClaimableMorphoReward[] = data.rewards.flatMap((reward) => {
      return reward.tokens
        .filter((token) => token.available != '0')
        .map((token) => {
          return {
            urd: reward.rewards_distributor as Address,
            reward: {
              address: token.token.address,
              decimals: token.token.decimals,
              symbol: token.token.symbol,
              name: token.token.name,
            },
            amount: safeParseBigInt(token.available) ? BigInt(token.available) : 0n,
            claimable: safeParseBigInt(token.available) ? BigInt(token.available) : 0n,
            rewardSymbol: token.token.symbol,
            proof: token.args ? (token.args.proof as Proof) : [],
          }
        })
    })
    const accrued: MorphoReward[] = data.rewards.flatMap((reward) => {
      return reward.tokens
        .filter((token) => token.accrued !== '0')
        .map((token) => {
          return {
            urd: reward.rewards_distributor as Address,
            reward: {
              address: token.token.address,
              decimals: token.token.decimals,
              symbol: token.token.symbol,
              name: token.token.name,
            },
            rewardSymbol: token.token.symbol,
            amount: safeParseBigInt(token.accrued) ? BigInt(token.accrued) : 0n,
          }
        })
    })

    const allTokens = data.rewards
      .flatMap((reward) => reward.tokens)
      .reduce((acc, token) => {
        const existing = acc.find((t) => t.token.address === token.token.address)
        if (existing) {
          return acc
        }
        return [...acc, token]
      }, [] as TokenInfo[])

    const claimsAggregated: MorphoAggregatedClaims[] = allTokens
      .map((token) => {
        const claimedForReward = claimed
          .filter((c) => c.reward.address === token.token.address)
          .reduce((acc, c) => acc + c.amount, 0n)
        const claimableForReward = claimable
          .filter((c) => c.reward.address === token.token.address)
          .reduce((acc, c) => acc + c.amount, 0n)
        const accruedForReward = accrued
          .filter((c) => c.reward.address === token.token.address)
          .reduce((acc, c) => acc + c.amount, 0n)
        const total = accruedForReward
        return {
          rewardToken: token.token,
          claimable: claimableForReward,
          claimed: claimedForReward,
          accrued: accruedForReward,
          total: total,
        }
      })
      .reduce((acc, claim) => {
        const existing = acc.find((c) => c.rewardToken.address === claim.rewardToken.address)
        if (existing) {
          existing.claimable += claim.claimable
          existing.claimed += claim.claimed
          existing.accrued += claim.accrued
          existing.total += claim.total
          return acc
        }
        return [...acc, claim]
      }, [] as MorphoAggregatedClaims[])

    return {
      claimable,
      claimed,
      accrued,
      claimsAggregated,
    }
  } catch (error) {
    return {
      claimable: [],
      claimed: [],
      accrued: [],
      claimsAggregated: [],
    }
  }
}
