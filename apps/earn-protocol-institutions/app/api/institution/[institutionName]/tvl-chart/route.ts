import { NextResponse } from 'next/server'

import { getInstitutionTvlChartData } from '@/app/server-handlers/institution/get-institution-tvl-chart-data'
import { validateInstitutionUserSession } from '@/app/server-handlers/institution/utils/validate-user-session'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ institutionName: string }> },
) {
  const { institutionName } = await params

  await validateInstitutionUserSession({ institutionName })

  const data = await getInstitutionTvlChartData({ institutionName })

  return NextResponse.json(data)
}
