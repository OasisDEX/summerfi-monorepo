import { NextResponse } from 'next/server'

import { getRwaVaultsListData } from '@/app/server-handlers/vaults-list/get-rwa-vaults-list-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get('walletAddress') ?? undefined

  return NextResponse.json(await getRwaVaultsListData(walletAddress))
}
