import { Button } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { readSession } from '@/app/server-handlers/auth/session'
import {
  getCachedAllInstitutionsList,
  getCachedInstitutionData,
  getCachedUserInstitutionsList,
} from '@/app/server-handlers/institution/institution-data'
import { validateInstitutionUserSession } from '@/app/server-handlers/institution/utils/validate-user-session'
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

  // Authorize: the user must belong to this institution (global admins may access any). This guards
  // the ENTIRE institution subtree — without it, any authenticated user could read another
  // institution's data by changing the URL. Redirects (and logs out) on failure.
  await validateInstitutionUserSession({ institutionName })

  const [institution, userInstitutionsList] = await Promise.all([
    getCachedInstitutionData({ institutionName }),
    // Global admins can access any institution, so feed the selector every institution. Regular
    // users see only the institutions they belong to (their institution_users rows).
    session.user?.isGlobalAdmin
      ? getCachedAllInstitutionsList()
      : getCachedUserInstitutionsList({ userSub: session.sub }),
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
