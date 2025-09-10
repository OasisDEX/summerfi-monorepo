import { Button } from '@summerfi/app-earn-ui'
import Link from 'next/link'

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
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
        }}
      >
        Please log in to view this page.
        <Link href="/">
          <Button variant="secondaryMedium">Log In</Button>
        </Link>
      </div>
    )
  }

  const [institution, userInstitutionsList] = await Promise.all([
    getInstitutionData(institutionId),
    getUserInstitutionsList(session.sub),
  ])

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
