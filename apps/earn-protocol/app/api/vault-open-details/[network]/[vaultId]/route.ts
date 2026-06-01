import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { NextResponse } from 'next/server'

import { getVaultOpenDetailsData } from '@/app/server-handlers/vault-open/get-vault-open-details-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ network: string; vaultId: string }> },
) {
  const { network, vaultId } = await params

  const data = await getVaultOpenDetailsData({
    network: network as SupportedSDKNetworks,
    vaultId,
  })

  return NextResponse.json(data)
}
