import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { NextResponse } from 'next/server'

import { getVaultDetailsContentData } from '@/app/server-handlers/vault-details/get-vault-details-content-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ network: string; vaultId: string }> },
) {
  const { network, vaultId } = await params

  const data = await getVaultDetailsContentData({
    network: network as SupportedSDKNetworks,
    vaultId,
  })

  return NextResponse.json(data)
}
