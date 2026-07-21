import { type Address } from 'viem'

import { fleetCommanderAbi, stakingRewardsManagerAbi } from '@/constants/abis'
import { CORE_ADDRESSES } from '@/constants/addresses'
import { getPublicClient } from '@/lib/clients'
import { type FleetPosition } from '@/lib/positions'

export interface ExitContext {
  allowance: bigint
  paused: boolean
  hasClaimableRewards: boolean
}

export const readExitContext = async (
  position: FleetPosition,
  user: Address,
): Promise<ExitContext> => {
  const client = getPublicClient(position.chainId)
  const { admiralsQuarters } = CORE_ADDRESSES[position.chainId]

  const [allowance, paused] = await Promise.all([
    client.readContract({
      address: position.fleetAddress,
      abi: fleetCommanderAbi,
      functionName: 'allowance',
      args: [user, admiralsQuarters],
    }),
    client
      .readContract({
        address: position.fleetAddress,
        abi: fleetCommanderAbi,
        functionName: 'paused',
      })
      .catch(() => false),
  ])

  let hasClaimableRewards = false

  if (position.stakingRewardsManager) {
    try {
      const rewardsManager = position.stakingRewardsManager
      const count = await client.readContract({
        address: rewardsManager,
        abi: stakingRewardsManagerAbi,
        functionName: 'rewardTokensLength',
      })
      const rewardTokens = await Promise.all(
        Array.from({ length: Number(count) }, (_, index) =>
          client.readContract({
            address: rewardsManager,
            abi: stakingRewardsManagerAbi,
            functionName: 'rewardTokens',
            args: [BigInt(index)],
          }),
        ),
      )
      const earned = await Promise.all(
        rewardTokens.map((token) =>
          client.readContract({
            address: rewardsManager,
            abi: stakingRewardsManagerAbi,
            functionName: 'earned',
            args: [user, token],
          }),
        ),
      )

      hasClaimableRewards = earned.some((amount) => amount > 0n)
    } catch {
      hasClaimableRewards = false // cosmetic — never block the exit on a rewards read failure
    }
  }

  return { allowance, paused, hasClaimableRewards }
}
