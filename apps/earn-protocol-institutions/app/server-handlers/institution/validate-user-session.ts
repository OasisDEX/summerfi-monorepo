import { redirect } from 'next/navigation'

import { logout } from '@/app/server-handlers/auth/logout'
import { readSession } from '@/app/server-handlers/auth/session'

export const validateInstitutionUserSession = async ({
  institutionId,
  institutionName,
}: {
  institutionId?: string
  institutionName?: string
}) => {
  const session = await readSession()

  const hasValidSession = session && session.exp * 1000 > Date.now()

  if (!institutionId && !institutionName) {
    throw new Error('institutionId or institutionName is required')
  }

  const isUserInInstitutionId = session?.user?.institutionsList
    ?.map(({ name: iName }) => iName)
    .includes(institutionName ?? '')

  const isUserInInstitutionName = session?.user?.institutionsList
    ?.map(({ id: iId }) => iId)
    .includes(Number(institutionId))

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const isUserInInstitution = isUserInInstitutionId || isUserInInstitutionName

  if (!hasValidSession || !isUserInInstitution) {
    // eslint-disable-next-line no-console
    console.log(
      `User is not authorized to manage institution (${institutionId}) users, user institutions:`,
      JSON.stringify(session?.user?.institutionsList),
    )
    try {
      await logout()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error destroying session:', error)
    }
    redirect(`/?error=unauthorized`)
  }
}
