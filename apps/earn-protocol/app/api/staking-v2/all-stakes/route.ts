import { NextResponse } from 'next/server'

import { getCachedSumrStakingV2AllStakesData } from '@/app/server-handlers/cached/get-sumr-staking-v2-all-stakes-data'
import { type SumrStakingV2AllStakesSlimData } from '@/app/server-handlers/raw-calls/sumr-staking-v2/types'

export async function GET() {
  const allStakes = await getCachedSumrStakingV2AllStakesData().catch(() => [])

  const allStakesSlim: SumrStakingV2AllStakesSlimData = allStakes.map((stake) => ({
    owner: stake.owner,
    index: stake.index,
    amount: stake.amount,
    lockupPeriod: stake.lockupPeriod,
    lockupEndTime: stake.lockupEndTime,
  }))

  return NextResponse.json({ allStakes: allStakesSlim })
}
