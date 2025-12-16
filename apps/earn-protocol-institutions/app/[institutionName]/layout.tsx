import { Button } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { readSession } from '@/app/server-handlers/auth/session'
import {
  getInstitutionData,
  getUserInstitutionsList,
} from '@/app/server-handlers/institution/institution-data'
import { InstitutionPageHeader } from '@/components/layout/InstitutionPageHeader/InstitutionPageHeader'

import institutionMainLayoutStyles from './InstitutionMainLayout.module.css'

export default async function InstitutionMainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ institutionName: string }>
}) {
  const [{ institutionName }, session] = await Promise.all([params, readSession()])

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
    getInstitutionData(institutionName),
    getUserInstitutionsList(session.sub),
  ])

  if (!institutionName || !institution) {
    // Handle institution not found
    return <div>Institution not found.</div>
  }

  return (
    <div className={institutionMainLayoutStyles.institutionPageView}>
      <InstitutionPageHeader
        selectedInstitution={institution}
        institutionsList={userInstitutionsList}
      />
      {children}
    </div>
  )
}
