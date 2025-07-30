import { redirect } from 'next/navigation'

import { getInstitutionData } from '@/app/server-handlers/get-institution-data'
import { InstitutionPageView } from '@/components/layout/InstitutionPageView/InstitutionPageView'

const InstitutionPage = async ({ params }: { params: { institutionId: string } }) => {
  const { institutionId } = await params

  const institution = await getInstitutionData(institutionId)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!institution) {
    return redirect('/not-found')
  }

  return (
    <InstitutionPageView
      institutionName={institution.name}
      totalValue={institution.totalValue}
      numberOfVaults={institution.numberOfVaults}
      thirtyDayAvgApy={institution.thirtyDayAvgApy}
      allTimePerformance={institution.allTimePerformance}
      vaultData={institution.vaultData}
    />
  )
}

export default InstitutionPage
