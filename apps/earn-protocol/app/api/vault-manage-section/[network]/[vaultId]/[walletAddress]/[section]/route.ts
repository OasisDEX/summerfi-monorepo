import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { NextResponse } from 'next/server'

import {
  type VaultManageSection,
  vaultManageSectionHandlers,
} from '@/app/server-handlers/vault-manage/get-vault-manage-section-data'

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ network: string; vaultId: string; walletAddress: string; section: string }>
  },
) {
  const { network, vaultId, walletAddress, section } = await params

  const handler = vaultManageSectionHandlers[section as VaultManageSection] as
    | (typeof vaultManageSectionHandlers)[VaultManageSection]
    | undefined

  if (!handler) {
    return NextResponse.json({ error: `Unknown section: ${section}` }, { status: 404 })
  }

  const data = await handler({
    network: network as SupportedSDKNetworks,
    vaultId,
    walletAddress,
  })

  return NextResponse.json(data)
}
