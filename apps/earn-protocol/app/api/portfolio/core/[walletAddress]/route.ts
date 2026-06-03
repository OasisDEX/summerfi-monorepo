import { NextResponse } from 'next/server'

import { getPortfolioCoreData } from '@/app/server-handlers/portfolio/get-portfolio-core-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  const { walletAddress } = await params

  const data = await getPortfolioCoreData({ walletAddress })

  return NextResponse.json(data)
}
