import { redirect } from 'next/navigation'

import { logout } from '@/app/server-handlers/auth/logout'
import { readSession } from '@/app/server-handlers/auth/session'

export const validateInstitutionUserSession = async (institutionId: string) => {
  const session = await readSession()

  const hasValidSession = session && session.exp * 1000 > Date.now()
  const isUserInInstitution = session?.user?.institutionsList
    ?.map(({ id }) => String(id))
    .includes(institutionId)

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
