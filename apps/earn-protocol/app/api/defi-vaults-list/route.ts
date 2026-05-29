import { NextResponse } from 'next/server'

import { getDefiVaultsListData } from '@/app/server-handlers/vaults-list/get-defi-vaults-list-data'
import { isValidAddress } from '@/helpers/is-valid-address'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get('walletAddress') ?? undefined

  const isValidWalletAddress = isValidAddress(walletAddress)

  if (walletAddress && !isValidWalletAddress) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  return NextResponse.json(await getDefiVaultsListData(walletAddress))
}
