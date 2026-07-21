/* Read-only smoke test for the SUMR staking (V2) read path on Base.
 * Run: npx tsx apps/earn-exit/scripts/check-staked-sumr.ts 0xYourAddress
 */
import { type Address, formatUnits } from 'viem'

import { getStakedSumr } from '../lib/staking'

const main = async () => {
  const user = process.argv[2] as Address

  if (!user?.startsWith('0x')) throw new Error('usage: check-staked-sumr.ts <address>')

  const { position, failed } = await getStakedSumr(user)

  if (failed) {
    console.warn('Base RPC read failed — could not check SUMR staking.')

    return
  }

  if (!position) {
    console.log(`No staked SUMR (and no claimable rewards) for ${user}.`)

    return
  }

  const fmt = (amount: bigint, decimals = position.sumrDecimals) => formatUnits(amount, decimals)

  console.log(
    `Staked ${position.sumrSymbol}: ${fmt(position.totalStaked)} across ${position.stakes.length} stake(s)`,
    `(penaltyEnabled=${position.penaltyEnabled})`,
  )

  for (const stake of position.stakes) {
    const lock = stake.isLocked
      ? `locked until ${new Date(Number(stake.lockupEndTime) * 1000).toISOString()}`
      : 'unlocked'
    const penalty =
      stake.penaltyAmount !== null
        ? `, penalty ${stake.penaltyPercentage?.toFixed(2)}% (${fmt(stake.penaltyAmount)} ${position.sumrSymbol})`
        : ''

    console.log(`  stake[${stake.index}]: ${fmt(stake.amount)} ${position.sumrSymbol} — ${lock}${penalty}`)
  }

  for (const reward of position.rewards) {
    console.log(`  claimable: ${fmt(reward.earned, reward.decimals)} ${reward.symbol}`)
  }
}

void main()
