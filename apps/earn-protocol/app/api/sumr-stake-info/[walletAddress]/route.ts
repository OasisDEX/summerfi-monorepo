import { addressSchema } from '@summerfi/serverless-shared'
import { NextResponse } from 'next/server'
import { zeroAddress } from 'viem'
import { z } from 'zod'

import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { type SumrUserStakeInfoData } from '@/features/claim-and-delegate/types'

const fallbackResponse: SumrUserStakeInfoData = {
  sumrStakeInfo: {
    delegatedToV1: zeroAddress,
    delegatedToV2: zeroAddress,
    delegatedToDecayFactor: 0,
    sumrDelegated: '0',
    stakedAmount: '0',
  },
  sumrBalances: {
    mainnet: '0',
    arbitrum: '0',
    optimism: '0',
    base: '0',
    sonic: '0',
    hyperliquid: '0',
    total: '0',
    vested: '0',
    raw: {
      mainnet: '0',
      arbitrum: '0',
      base: '0',
      optimism: '0',
      sonic: '0',
      hyperliquid: '0',
      total: '0',
      vested: '0',
    },
  },
  sumrStakingInfo: {
    sumrTokenWrappedStakedAmount: 0,
    sumrTokenDailyEmissionAmount: 0,
    sumrStakingApy: 0,
  },
}

const sumrStakeInfoSchema = z.object({
  walletAddress: addressSchema,
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  const { walletAddress } = await params

  const { success } = sumrStakeInfoSchema.safeParse({ walletAddress })

  if (!success) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  try {
    const sumrStakeInfo = await getSumrDelegateStake({ walletAddress })
    const sumrBalances = await getSumrBalances({ walletAddress })
    const sumrStakingInfo = await getSumrStakingInfo()

    return NextResponse.json({ sumrStakeInfo, sumrBalances, sumrStakingInfo })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in sumr-stake-info route:', error)

    return NextResponse.json(fallbackResponse)
  }
}
