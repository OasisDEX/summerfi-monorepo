import { NextResponse } from 'next/server'

import { getVaultOverviewChartsData } from '@/app/server-handlers/institution/get-vault-overview-charts-data'
import { validateInstitutionUserSession } from '@/app/server-handlers/institution/utils/validate-user-session'

export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ institutionName: string; network: string; vaultAddress: string }> },
) {
  const { institutionName, network, vaultAddress } = await params

  await validateInstitutionUserSession({ institutionName })

  const data = await getVaultOverviewChartsData({ institutionName, network, vaultAddress })

  return NextResponse.json(data)
}
