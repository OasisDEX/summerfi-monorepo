import { type Address, erc20Abi, formatUnits } from 'viem'

import { summerStakingAbi } from '@/constants/abis'
import { SUMR_STAKING } from '@/constants/addresses'
import { getPublicClient } from '@/lib/clients'

/** One SUMR stake, keyed by its position in the on-chain user-stakes array. */
export interface SumrStake {
  /** Array index in the contract — this IS the `stakeIndex` arg to `unstakeLockup`. */
  index: number
  amount: bigint
  weightedAmount: bigint
  lockupEndTime: bigint
  lockupPeriod: bigint
  /** lockupEndTime is in the future (read against wall-clock at fetch time). */
  isLocked: boolean
  /** Early-unstake penalty as a percentage 0–100 (null when penalties are disabled/expired). */
  penaltyPercentage: number | null
  /** Absolute penalty in SUMR base units for fully unstaking this stake (null ⇒ no penalty). */
  penaltyAmount: bigint | null
}

export interface SumrReward {
  token: Address
  symbol: string
  decimals: number
  earned: bigint
}

export interface StakedSumrPosition {
  chainId: number
  stakingAddress: Address
  /** stSUMR — the token the user must approve before unstaking. */
  stakedToken: Address
  sumrToken: Address
  sumrSymbol: string
  sumrDecimals: number
  penaltyEnabled: boolean
  totalStaked: bigint
  stakes: SumrStake[]
  /** Only reward tokens with a positive earned balance. */
  rewards: SumrReward[]
}

/**
 * Reads a user's V2 SUMR staking position on Base: every stake (with lockup + early-unstake
 * penalty) plus any claimable rewards. Returns `{ position: null }` when the user has nothing
 * staked and nothing to claim. `failed` is true only when the Base RPC itself errored, so the
 * caller can distinguish "no stake" from "couldn't check" (mirrors `getAllPositions`).
 */
export const getStakedSumr = async (
  user: Address,
): Promise<{ position: StakedSumrPosition | null; failed: boolean }> => {
  const { chainId, summerStaking } = SUMR_STAKING

  try {
    const client = getPublicClient(chainId)

    // Round 1: config + counts. `allowFailure: false` so a dead RPC throws into the catch below
    // rather than silently returning an empty section.
    const [stakesCount, stakedToken, sumrToken, penaltyEnabled, rewardTokensLength] =
      await client.multicall({
        contracts: [
          {
            address: summerStaking,
            abi: summerStakingAbi,
            functionName: 'getUserStakesCount',
            args: [user],
          },
          { address: summerStaking, abi: summerStakingAbi, functionName: 'STAKED_SUMMER_TOKEN' },
          { address: summerStaking, abi: summerStakingAbi, functionName: 'SUMMER_TOKEN' },
          { address: summerStaking, abi: summerStakingAbi, functionName: 'penaltyEnabled' },
          { address: summerStaking, abi: summerStakingAbi, functionName: 'rewardTokensLength' },
        ],
        allowFailure: false,
      })

    const count = Number(stakesCount)
    const rewardCount = Number(rewardTokensLength)

    // Round 2 (summerStaking only): each stake tuple + the reward-token address list. Kept
    // ABI-homogeneous — viem cannot infer a mixed-ABI contracts tuple.
    const [stakeResults, rewardTokenResults] = await Promise.all([
      client.multicall({
        contracts: Array.from(
          { length: count },
          (_, index) =>
            ({
              address: summerStaking,
              abi: summerStakingAbi,
              functionName: 'getUserStake',
              args: [user, BigInt(index)],
            }) as const,
        ),
        allowFailure: true,
      }),
      client.multicall({
        contracts: Array.from(
          { length: rewardCount },
          (_, index) =>
            ({
              address: summerStaking,
              abi: summerStakingAbi,
              functionName: 'rewardTokens',
              args: [BigInt(index)],
            }) as const,
        ),
        allowFailure: true,
      }),
    ])

    // Keep only non-empty stakes.
    const rawStakes = stakeResults
      .map((result, index) => {
        if (result.status !== 'success') return null

        const [amount, weightedAmount, lockupEndTime, lockupPeriod] = result.result as readonly [
          bigint,
          bigint,
          bigint,
          bigint,
        ]

        return { index, amount, weightedAmount, lockupEndTime, lockupPeriod }
      })
      .filter((stake): stake is NonNullable<typeof stake> => stake !== null && stake.amount > 0n)

    const rewardAddresses = rewardTokenResults
      .map((result) => (result.status === 'success' ? (result.result as Address) : null))
      .filter((address): address is Address => address !== null)

    const nowSeconds = BigInt(Math.floor(Date.now() / 1000))
    const penaltyStakes = penaltyEnabled
      ? rawStakes.filter((stake) => stake.lockupEndTime > nowSeconds)
      : []

    // Round 3, run in parallel and split by ABI so each multicall stays homogeneous:
    //  - staking reads: per-locked-stake penalty (%, absolute) + per-reward `earned`
    //  - erc20 reads: SUMR + reward-token symbol/decimals
    const [penaltyResults, earnedResults, sumrMeta, rewardMeta] = await Promise.all([
      client.multicall({
        contracts: penaltyStakes.flatMap((stake) => [
          {
            address: summerStaking,
            abi: summerStakingAbi,
            functionName: 'calculatePenaltyPercentage',
            args: [user, BigInt(stake.index)],
          } as const,
          {
            address: summerStaking,
            abi: summerStakingAbi,
            functionName: 'calculatePenalty',
            args: [user, stake.amount, BigInt(stake.index)],
          } as const,
        ]),
        allowFailure: true,
      }),
      client.multicall({
        contracts: rewardAddresses.map(
          (token) =>
            ({
              address: summerStaking,
              abi: summerStakingAbi,
              functionName: 'earned',
              args: [user, token],
            }) as const,
        ),
        allowFailure: true,
      }),
      client.multicall({
        contracts: [
          { address: sumrToken as Address, abi: erc20Abi, functionName: 'symbol' } as const,
          { address: sumrToken as Address, abi: erc20Abi, functionName: 'decimals' } as const,
        ],
        allowFailure: true,
      }),
      client.multicall({
        contracts: rewardAddresses.flatMap((token) => [
          { address: token, abi: erc20Abi, functionName: 'symbol' } as const,
          { address: token, abi: erc20Abi, functionName: 'decimals' } as const,
        ]),
        allowFailure: true,
      }),
    ])

    const sumrSymbol = sumrMeta[0].status === 'success' ? (sumrMeta[0].result as string) : 'SUMR'
    const sumrDecimals = sumrMeta[1].status === 'success' ? Number(sumrMeta[1].result) : 18

    const penaltyByIndex = new Map<number, { percentage: number | null; amount: bigint | null }>()

    penaltyStakes.forEach((stake, order) => {
      const base = order * 2
      const percentageResult = penaltyResults[base]
      const amountResult = penaltyResults[base + 1]
      // calculatePenaltyPercentage is WAD-scaled (1e18 = 100%), so /1e16 = percent.
      const percentage =
        percentageResult.status === 'success'
          ? Number(formatUnits(percentageResult.result as bigint, 16))
          : null
      const amount = amountResult.status === 'success' ? (amountResult.result as bigint) : null

      penaltyByIndex.set(stake.index, { percentage, amount })
    })

    const stakes: SumrStake[] = rawStakes.map((stake) => {
      const penalty = penaltyByIndex.get(stake.index)

      return {
        ...stake,
        isLocked: stake.lockupEndTime > nowSeconds,
        penaltyPercentage: penalty?.percentage ?? null,
        penaltyAmount: penalty?.amount ?? null,
      }
    })

    const rewards: SumrReward[] = rewardAddresses
      .map((token, order) => {
        const metaBase = order * 2
        const earnedResult = earnedResults[order]
        const symbolRes = rewardMeta[metaBase]
        const decimalsRes = rewardMeta[metaBase + 1]
        const earned = earnedResult.status === 'success' ? (earnedResult.result as bigint) : 0n

        return {
          token,
          symbol: symbolRes.status === 'success' ? (symbolRes.result as string) : '',
          decimals: decimalsRes.status === 'success' ? Number(decimalsRes.result) : 18,
          earned,
        }
      })
      .filter((reward) => reward.earned > 0n)

    const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0n)

    if (stakes.length === 0 && rewards.length === 0) {
      return { position: null, failed: false }
    }

    return {
      position: {
        chainId,
        stakingAddress: summerStaking,
        stakedToken: stakedToken as Address,
        sumrToken: sumrToken as Address,
        sumrSymbol,
        sumrDecimals,
        penaltyEnabled,
        totalStaked,
        stakes,
        rewards,
      },
      failed: false,
    }
  } catch {
    return { position: null, failed: true }
  }
}
