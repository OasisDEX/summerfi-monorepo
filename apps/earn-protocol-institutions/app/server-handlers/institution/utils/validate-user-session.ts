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

  const institutionsList = session?.user?.institutionsList ?? []

  // Match on whichever identifier the caller supplied. Compare ids as strings so a non-numeric
  // institutionId doesn't become NaN and silently fail to match.
  const matchesByName =
    institutionName !== undefined &&
    institutionsList.some(({ name: entryName }) => entryName === institutionName)

  const matchesById =
    institutionId !== undefined &&
    institutionsList.some(({ id }) => String(id) === String(institutionId))

  const isUserInInstitution = matchesByName || matchesById

  if (!hasValidSession || !isUserInInstitution) {
    try {
      await logout()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error destroying session:', error)
    }
    redirect(`/?error=unauthorized`)
  }
}
