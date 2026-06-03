import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { NextResponse } from 'next/server'

import { getPortfolioPositionHistoryData } from '@/app/server-handlers/portfolio/get-portfolio-position-history-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ walletAddress: string; network: string; vaultId: string }> },
) {
  const { walletAddress, network, vaultId } = await params

  const data = await getPortfolioPositionHistoryData({
    walletAddress,
    network: network as SupportedSDKNetworks,
    vaultId,
  })

  return NextResponse.json(data)
}
