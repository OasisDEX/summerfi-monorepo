import { decodeFunctionData, type Hex } from 'viem'

import { admiralsQuartersAbi, fleetCommanderAbi, stakingRewardsManagerAbi } from '@/constants/abis'
import { CORE_ADDRESSES } from '@/constants/addresses'

import { buildExitPlan } from './exit-plan'
import { type FleetPosition } from './positions'

// Doc's literal address failed viem's EIP-55 checksum validation (typo'd casing); using the
// correctly checksummed form of the same address — see phase-4 report for details.
const FLEET = '0x98C49e13bf99D7CAd8069faa2A370933EC9EcF17' as const
const RM = '0x1111111111111111111111111111111111111111' as const
const AQ = CORE_ADDRESSES[8453].admiralsQuarters

const basePosition: FleetPosition = {
  chainId: 8453,
  fleetAddress: FLEET,
  fleetName: 'LazyVault_LowerRisk_USDC',
  displayName: 'USDC Base Lower Risk',
  asset: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', decimals: 6 },
  walletShares: 0n,
  stakedShares: 0n,
  totalShares: 0n,
  totalAssets: 0n,
  stakingRewardsManager: RM,
}

const decodeMulticall = (data: Hex) => {
  const outer = decodeFunctionData({ abi: admiralsQuartersAbi, data })

  expect(outer.functionName).toBe('multicall')

  return (outer.args[0] as Hex[]).map((inner) =>
    decodeFunctionData({ abi: admiralsQuartersAbi, data: inner }),
  )
}

describe('buildExitPlan', () => {
  it('wallet shares only, insufficient allowance -> [approve, exit(exitFleet+withdrawTokens)]', () => {
    const plan = buildExitPlan({
      position: { ...basePosition, walletShares: 100n, totalShares: 100n },
      allowance: 0n,
      hasClaimableRewards: false,
    })

    expect(plan.map((step) => step.type)).toEqual(['approve', 'exit'])

    const approve = decodeFunctionData({ abi: fleetCommanderAbi, data: plan[0].tx.data })

    expect(plan[0].tx.to).toBe(FLEET)
    expect(approve.functionName).toBe('approve')
    expect(approve.args).toEqual([AQ, 100n])

    expect(plan[1].tx.to).toBe(AQ)
    const inner = decodeMulticall(plan[1].tx.data)

    expect(inner.map((call) => call.functionName)).toEqual(['exitFleet', 'withdrawTokens'])
    expect(inner[0].args).toEqual([FLEET, 0n])
    expect(inner[1].args).toEqual([basePosition.asset.address, 0n])
  })

  it('sufficient allowance -> approve skipped', () => {
    const plan = buildExitPlan({
      position: { ...basePosition, walletShares: 100n, totalShares: 100n },
      allowance: 100n,
      hasClaimableRewards: false,
    })

    expect(plan.map((step) => step.type)).toEqual(['exit'])
  })

  it('wallet + staked -> multicall carries all three calls in SDK order', () => {
    const plan = buildExitPlan({
      position: { ...basePosition, walletShares: 100n, stakedShares: 50n, totalShares: 150n },
      allowance: 0n,
      hasClaimableRewards: true, // staked leg claims via claimRewards=true -> no claim step
    })

    expect(plan.map((step) => step.type)).toEqual(['approve', 'exit'])
    const inner = decodeMulticall(plan[1].tx.data)

    expect(inner.map((call) => call.functionName)).toEqual([
      'exitFleet',
      'withdrawTokens',
      'unstakeAndWithdrawAssets',
    ])
    expect(inner[2].args).toEqual([FLEET, 0n, true])
  })

  it('staked only -> single multicall(unstakeAndWithdrawAssets), no approve', () => {
    const plan = buildExitPlan({
      position: { ...basePosition, stakedShares: 50n, totalShares: 50n },
      allowance: 0n,
      hasClaimableRewards: false,
    })

    expect(plan.map((step) => step.type)).toEqual(['exit'])
    const inner = decodeMulticall(plan[0].tx.data)

    expect(inner.map((call) => call.functionName)).toEqual(['unstakeAndWithdrawAssets'])
  })

  it('leftover rewards with zero staked shares -> claim step appended', () => {
    const plan = buildExitPlan({
      position: { ...basePosition, walletShares: 100n, totalShares: 100n },
      allowance: 100n,
      hasClaimableRewards: true,
    })

    expect(plan.map((step) => step.type)).toEqual(['exit', 'claim'])
    expect(plan[1].tx.to).toBe(RM)

    const claim = decodeFunctionData({ abi: stakingRewardsManagerAbi, data: plan[1].tx.data })

    expect(claim.functionName).toBe('getReward')
  })

  it('every tx carries the position chainId and zero value', () => {
    const plan = buildExitPlan({
      position: { ...basePosition, walletShares: 1n, stakedShares: 1n, totalShares: 2n },
      allowance: 0n,
      hasClaimableRewards: false,
    })

    for (const step of plan) {
      expect(step.tx.chainId).toBe(8453)
      expect(step.tx.value).toBe(0n)
    }
  })
})
