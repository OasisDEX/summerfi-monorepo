import { NextResponse } from 'next/server'

import { validateInstitutionUserSession } from '@/app/server-handlers/institution/validate-user-session'
import { getWalletDetails } from '@/app/server-handlers/sdk/get-wallet-details'

export const POST = async (request: Request) => {
  const requestData = await request.json()
  const { institutionName } = requestData

  if (!institutionName || typeof institutionName !== 'string') {
    return NextResponse.json({ error: 'institutionName is required' }, { status: 400 })
  }

  await validateInstitutionUserSession({ institutionName })

  return NextResponse.json(
    await getWalletDetails({
      institutionName,
      walletAddress: requestData.walletAddress,
    }),
  )
}
