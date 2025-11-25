import { NextResponse } from 'next/server'

import { validateInstitutionUserSession } from '@/app/server-handlers/institution/utils/validate-user-session'
import { getWalletDetails } from '@/app/server-handlers/sdk/get-wallet-details'

export const POST = async (request: Request) => {
  const requestData = await request.json()
  const { institutionName, walletAddress } = requestData

  if (
    !institutionName ||
    typeof institutionName !== 'string' ||
    !walletAddress ||
    typeof walletAddress !== 'string'
  ) {
    return NextResponse.json({ error: 'institutionName is required' }, { status: 400 })
  }
  await validateInstitutionUserSession({ institutionName })
  const data = await getWalletDetails({ institutionName, walletAddress })

  if (!data) {
    return NextResponse.json({ error: 'wallet not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
