import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { InstitutionPageDataBlocks } from '@/components/layout/InstitutionPageDataBlocks/InstitutionPageDataBlocks'
import { InstitutionPageHeader } from '@/components/layout/InstitutionPageHeader/InstitutionPageHeader'

import institutionMainLayoutStyles from './InstitutionMainLayout.module.css'

export default async function InstitutionMainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ institutionId: string }>
}) {
  const [{ institutionId }] = await Promise.all([params])
  const institution = await getInstitutionData(institutionId)

  return (
    <div className={institutionMainLayoutStyles.institutionPageView}>
      <InstitutionPageHeader institutionName={institution.institutionName} />
      <InstitutionPageDataBlocks
        totalValue={institution.totalValue}
        numberOfVaults={institution.numberOfVaults}
        thirtyDayAvgApy={institution.thirtyDayAvgApy}
        allTimePerformance={institution.allTimePerformance}
      />
      {children}
    </div>
  )
}
