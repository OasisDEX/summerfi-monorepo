import { NextResponse } from 'next/server'

import { getDefiVaultsListData } from '@/app/server-handlers/vaults-list/get-defi-vaults-list-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get('walletAddress') ?? undefined

  return NextResponse.json(await getDefiVaultsListData(walletAddress))
}
