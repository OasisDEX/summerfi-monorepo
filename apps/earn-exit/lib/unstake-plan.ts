import { type Address, encodeFunctionData, erc20Abi, type Hex } from 'viem'

import { summerStakingAbi } from '@/constants/abis'
import { type StakedSumrPosition, type SumrStake } from '@/lib/staking'

export type UnstakeStepType = 'approve' | 'unstake' | 'claim'

export interface UnstakeStep {
  type: UnstakeStepType
  label: string
  tx: { to: Address; data: Hex; value: bigint; chainId: number }
}

/**
 * Builds the ordered on-chain steps for unstaking a single SUMR stake and/or claiming rewards.
 *
 * Deliberately handles ONE stake at a time: `SummerStaking` reassigns array indices when a stake is
 * fully emptied (swap-and-pop), so a batch of `unstakeLockup` calls across indices would target the
 * wrong stakes. The caller re-reads the position between unstakes (the modal reloads on any executed
 * tx), and `claimRewards` is guarded on live `position.rewards` so a re-read after a claim never
 * re-emits an already-claimed reward.
 *
 * Approve the staked-receipt token (stSUMR) to the staking contract when the allowance is short,
 * then `unstakeLockup(stakeIndex, amount)`; claim is a self-claim `getReward(token)` per reward
 * token (NOT the SDK's on-behalf `getRewardFor`, which reverts for a direct user).
 */
export const buildUnstakePlan = (params: {
  position: StakedSumrPosition
  /** The stake to unstake, or `null` for a claim-only plan. */
  stake: SumrStake | null
  /** Current stSUMR allowance: user → staking contract. */
  stakedTokenAllowance: bigint
  claimRewards: boolean
}): UnstakeStep[] => {
  const { position, stake, stakedTokenAllowance, claimRewards } = params
  const { stakingAddress, stakedToken, chainId } = position
  const steps: UnstakeStep[] = []

  if (stake && stake.amount > 0n) {
    // 1. Approve the staked-receipt token (stSUMR) so the staking contract can pull it on unstake.
    if (stakedTokenAllowance < stake.amount) {
      steps.push({
        type: 'approve',
        label: 'Approve staked SUMR',
        tx: {
          to: stakedToken,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'approve',
            args: [stakingAddress, stake.amount],
          }),
          value: 0n,
          chainId,
        },
      })
    }

    // 2. Unstake the specific stake by its array index.
    steps.push({
      type: 'unstake',
      label: 'Unstake SUMR',
      tx: {
        to: stakingAddress,
        data: encodeFunctionData({
          abi: summerStakingAbi,
          functionName: 'unstakeLockup',
          args: [BigInt(stake.index), stake.amount],
        }),
        value: 0n,
        chainId,
      },
    })
  }

  // 3. Claim every reward token that currently has an earned balance.
  if (claimRewards) {
    for (const reward of position.rewards.filter((entry) => entry.earned > 0n)) {
      steps.push({
        type: 'claim',
        label: `Claim ${reward.symbol || 'rewards'}`,
        tx: {
          to: stakingAddress,
          data: encodeFunctionData({
            abi: summerStakingAbi,
            functionName: 'getReward',
            args: [reward.token],
          }),
          value: 0n,
          chainId,
        },
      })
    }
  }

  return steps
}
