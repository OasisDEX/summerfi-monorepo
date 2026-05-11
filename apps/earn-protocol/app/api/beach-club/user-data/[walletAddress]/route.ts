import { addressSchema } from '@summerfi/serverless-shared'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getCachedUserBeachClubData } from '@/app/server-handlers/cached/beach-club'

const beachClubUserDataSchema = z.object({
  walletAddress: addressSchema,
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  const { walletAddress } = await params

  const { success } = beachClubUserDataSchema.safeParse({ walletAddress })

  if (!success) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  try {
    const beachClubData = await getCachedUserBeachClubData(walletAddress)

    return NextResponse.json(beachClubData)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in beach-club user-data route:', error)

    return NextResponse.json({ error: 'Failed to fetch beach club user data' }, { status: 500 })
  }
}
