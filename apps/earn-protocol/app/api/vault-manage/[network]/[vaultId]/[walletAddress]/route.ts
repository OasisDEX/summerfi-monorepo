import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { NextResponse } from 'next/server'

import { getVaultManageCoreData } from '@/app/server-handlers/vault-manage/get-vault-manage-core-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ network: string; vaultId: string; walletAddress: string }> },
) {
  const { network, vaultId, walletAddress } = await params

  const data = await getVaultManageCoreData({
    network: network as SupportedSDKNetworks,
    vaultId,
    walletAddress,
  })

  return NextResponse.json(data)
}
