import { supportedSDKNetworkId } from '@summerfi/app-utils'
import { type NextRequest, NextResponse } from 'next/server'
import { isAddress } from 'viem'

import { getInstitutionVaultActivityLog } from '@/app/server-handlers/institution/institution-vaults'
import { validateInstitutionUserSession } from '@/app/server-handlers/institution/utils/validate-user-session'

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ vault: string }> },
) => {
  // /vault/activity-log/{institutionName-chainid-vaultAddress}/?weekNo=[number]
  const [institutionName, rawChainId, vaultAddress] = (await params).vault.split('-')

  if (!rawChainId || !vaultAddress || !isAddress(vaultAddress)) {
    return NextResponse.json({ error: 'Invalid vault id' }, { status: 400 })
  }
  const weekNo = request.nextUrl.searchParams.get('weekNo')

  if (!weekNo || isNaN(Number(weekNo)) || Number(weekNo) < 0) {
    return NextResponse.json({ error: 'Invalid week number' }, { status: 400 })
  }
  if (!institutionName || typeof institutionName !== 'string') {
    return NextResponse.json({ error: 'institutionName is required' }, { status: 400 })
  }
  await validateInstitutionUserSession({ institutionName })

  const chainId = supportedSDKNetworkId(Number(rawChainId))

  const weekActivityData = await getInstitutionVaultActivityLog({
    vaultAddress,
    chainId,
    weekNo: Number(weekNo),
  })

  return NextResponse.json(weekActivityData)
}
