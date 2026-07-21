import { type Address, encodeFunctionData, type Hex } from 'viem'

import { admiralsQuartersAbi, fleetCommanderAbi, stakingRewardsManagerAbi } from '@/constants/abis'
import { CORE_ADDRESSES } from '@/constants/addresses'
import { type FleetPosition } from '@/lib/positions'

export type ExitStepType = 'approve' | 'exit' | 'claim'

export interface ExitStep {
  type: ExitStepType
  label: string
  tx: { to: Address; data: Hex; value: bigint; chainId: number }
}

/**
 * Full exit to the underlying asset — replicates the SDK's AdmiralsQuarters route.
 * `0` amounts are the protocol's "everything" sentinel (see plan README).
 */
export const buildExitPlan = (params: {
  position: FleetPosition
  allowance: bigint
  hasClaimableRewards: boolean
}): ExitStep[] => {
  const { position, allowance, hasClaimableRewards } = params
  const { admiralsQuarters } = CORE_ADDRESSES[position.chainId]
  const steps: ExitStep[] = []

  // 1. Approve the fleet's share token to AdmiralsQuarters — wallet-held shares only.
  if (position.walletShares > 0n && allowance < position.walletShares) {
    steps.push({
      type: 'approve',
      label: `Approve ${position.displayName || position.fleetName} shares`,
      tx: {
        to: position.fleetAddress,
        data: encodeFunctionData({
          abi: fleetCommanderAbi,
          functionName: 'approve',
          args: [admiralsQuarters, position.walletShares],
        }),
        value: 0n,
        chainId: position.chainId,
      },
    })
  }

  // 2. The exit itself: one AdmiralsQuarters.multicall, SDK ordering.
  const calls: Hex[] = []

  if (position.walletShares > 0n) {
    calls.push(
      encodeFunctionData({
        abi: admiralsQuartersAbi,
        functionName: 'exitFleet',
        args: [position.fleetAddress, 0n],
      }),
      encodeFunctionData({
        abi: admiralsQuartersAbi,
        functionName: 'withdrawTokens',
        args: [position.asset.address, 0n],
      }),
    )
  }

  if (position.stakedShares > 0n) {
    calls.push(
      encodeFunctionData({
        abi: admiralsQuartersAbi,
        functionName: 'unstakeAndWithdrawAssets',
        args: [position.fleetAddress, 0n, true],
      }),
    )
  }

  if (calls.length > 0) {
    steps.push({
      type: 'exit',
      label: `Withdraw all ${position.asset.symbol}`,
      tx: {
        to: admiralsQuarters,
        data: encodeFunctionData({
          abi: admiralsQuartersAbi,
          functionName: 'multicall',
          args: [calls],
        }),
        value: 0n,
        chainId: position.chainId,
      },
    })
  }

  // 3. Rewards left behind after unstaking in the past (staked leg claims automatically).
  if (position.stakedShares === 0n && hasClaimableRewards && position.stakingRewardsManager) {
    steps.push({
      type: 'claim',
      label: 'Claim outstanding rewards',
      tx: {
        to: position.stakingRewardsManager,
        data: encodeFunctionData({ abi: stakingRewardsManagerAbi, functionName: 'getReward' }),
        value: 0n,
        chainId: position.chainId,
      },
    })
  }

  return steps
}
