import { readSession } from '@/app/server-handlers/auth/session'
import { getInstitutionData, getUserInstitutionsList } from '@/app/server-handlers/institution-data'
import { InstitutionPageHeader } from '@/components/layout/InstitutionPageHeader/InstitutionPageHeader'

import institutionMainLayoutStyles from './InstitutionMainLayout.module.css'

export default async function InstitutionMainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ institutionId: string }>
}) {
  const [{ institutionId }, session] = await Promise.all([params, readSession()])

  if (!session) {
    // Handle unauthenticated state
    return <div>Please log in to view this page.</div>
  }

  const institution = await getInstitutionData(institutionId)
  const userInstitutionsList = await getUserInstitutionsList(session.sub)

  if (!institutionId || !institution) {
    // Handle institution not found
    return <div>Institution not found.</div>
  }

  return (
    <div className={institutionMainLayoutStyles.institutionPageView}>
      <InstitutionPageHeader
        selectedInstitution={institution}
        institutionsList={userInstitutionsList}
      />
      {/* 
      <InstitutionPageDataBlocks
        totalValue={institution.totalValue}
        numberOfVaults={institution.numberOfVaults}
        thirtyDayAvgApy={institution.thirtyDayAvgApy}
        allTimePerformance={institution.allTimePerformance}
      /> */}
      {children}
    </div>
  )
}
