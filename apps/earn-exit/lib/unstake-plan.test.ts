import { decodeFunctionData, erc20Abi } from 'viem'

import { summerStakingAbi } from '@/constants/abis'
import { SUMR_STAKING } from '@/constants/addresses'

import { type StakedSumrPosition, type SumrStake } from './staking'
import { buildUnstakePlan } from './unstake-plan'

const STAKED_TOKEN = '0x2222222222222222222222222222222222222222' as const
const USDC = SUMR_STAKING.usdc
const SUMR = SUMR_STAKING.sumrToken
const STAKING = SUMR_STAKING.summerStaking

const stake = (overrides: Partial<SumrStake> = {}): SumrStake => ({
  index: 0,
  amount: 100n,
  weightedAmount: 100n,
  lockupEndTime: 0n,
  lockupPeriod: 0n,
  isLocked: false,
  penaltyPercentage: null,
  penaltyAmount: null,
  ...overrides,
})

const position = (overrides: Partial<StakedSumrPosition> = {}): StakedSumrPosition => ({
  chainId: 8453,
  stakingAddress: STAKING,
  stakedToken: STAKED_TOKEN,
  sumrToken: SUMR,
  sumrSymbol: 'SUMR',
  sumrDecimals: 18,
  penaltyEnabled: false,
  totalStaked: 100n,
  stakes: [stake()],
  rewards: [],
  ...overrides,
})

describe('buildUnstakePlan', () => {
  it('unstake, insufficient allowance -> [approve stStSUMR, unstakeLockup]', () => {
    const plan = buildUnstakePlan({
      position: position(),
      stake: stake({ index: 2, amount: 500n }),
      stakedTokenAllowance: 0n,
      claimRewards: false,
    })

    expect(plan.map((step) => step.type)).toEqual(['approve', 'unstake'])

    const approve = decodeFunctionData({ abi: erc20Abi, data: plan[0].tx.data })

    expect(plan[0].tx.to).toBe(STAKED_TOKEN)
    expect(approve.functionName).toBe('approve')
    expect(approve.args).toEqual([STAKING, 500n])

    const unstake = decodeFunctionData({ abi: summerStakingAbi, data: plan[1].tx.data })

    expect(plan[1].tx.to).toBe(STAKING)
    expect(unstake.functionName).toBe('unstakeLockup')
    expect(unstake.args).toEqual([2n, 500n])
  })

  it('sufficient staked-token allowance -> approve skipped', () => {
    const plan = buildUnstakePlan({
      position: position(),
      stake: stake({ amount: 100n }),
      stakedTokenAllowance: 100n,
      claimRewards: false,
    })

    expect(plan.map((step) => step.type)).toEqual(['unstake'])
  })

  it('claimRewards appends one self-claim getReward per reward token with earned > 0', () => {
    const plan = buildUnstakePlan({
      position: position({
        rewards: [
          { token: SUMR, symbol: 'SUMR', decimals: 18, earned: 10n },
          { token: USDC, symbol: 'USDC', decimals: 6, earned: 5n },
        ],
      }),
      stake: stake(),
      stakedTokenAllowance: 100n,
      claimRewards: true,
    })

    expect(plan.map((step) => step.type)).toEqual(['unstake', 'claim', 'claim'])

    const claimSumr = decodeFunctionData({ abi: summerStakingAbi, data: plan[1].tx.data })

    expect(claimSumr.functionName).toBe('getReward')
    expect(claimSumr.args).toEqual([SUMR])
    expect(plan[1].tx.to).toBe(STAKING)

    const claimUsdc = decodeFunctionData({ abi: summerStakingAbi, data: plan[2].tx.data })

    expect(claimUsdc.args).toEqual([USDC])
  })

  it('claim-only: no stake selected -> just claim steps', () => {
    const plan = buildUnstakePlan({
      position: position({ rewards: [{ token: SUMR, symbol: 'SUMR', decimals: 18, earned: 10n }] }),
      stake: null,
      stakedTokenAllowance: 0n,
      claimRewards: true,
    })

    expect(plan.map((step) => step.type)).toEqual(['claim'])
  })

  it('claimRewards true but no rewards -> no claim steps (safe after re-read)', () => {
    const plan = buildUnstakePlan({
      position: position({ rewards: [] }),
      stake: stake(),
      stakedTokenAllowance: 100n,
      claimRewards: true,
    })

    expect(plan.map((step) => step.type)).toEqual(['unstake'])
  })

  it('every tx carries the Base chainId and zero value', () => {
    const plan = buildUnstakePlan({
      position: position({ rewards: [{ token: SUMR, symbol: 'SUMR', decimals: 18, earned: 1n }] }),
      stake: stake(),
      stakedTokenAllowance: 0n,
      claimRewards: true,
    })

    for (const step of plan) {
      expect(step.tx.chainId).toBe(8453)
      expect(step.tx.value).toBe(0n)
    }
  })
})
