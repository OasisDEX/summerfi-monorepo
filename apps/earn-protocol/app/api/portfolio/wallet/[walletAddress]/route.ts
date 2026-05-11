import { addressSchema } from '@summerfi/serverless-shared'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getCachedWalletAssets } from '@/app/server-handlers/cached/get-wallet-assets'

const walletSchema = z.object({
  walletAddress: addressSchema,
})

const emptyWalletData = {
  totalAssetsUsdValue: 0,
  totalAssetsPercentageChange: 0,
  assets: [],
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  const { walletAddress } = await params

  const { success } = walletSchema.safeParse({ walletAddress })

  if (!success) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  try {
    const walletData = await getCachedWalletAssets(walletAddress)

    return NextResponse.json({
      walletData,
      error: false,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in portfolio wallet route:', error)

    return NextResponse.json({
      walletData: emptyWalletData,
      error: true,
    })
  }
}
