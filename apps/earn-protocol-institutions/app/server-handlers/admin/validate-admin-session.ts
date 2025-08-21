import { redirect } from 'next/navigation'

import { logout } from '@/app/server-handlers/auth/logout'
import { readSession } from '@/app/server-handlers/auth/session'

export const validateGlobalAdminSession = async () => {
  const session = await readSession()

  if (!session || !session.user?.isGlobalAdmin) {
    try {
      await logout()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error destroying session:', error)
    }
    redirect(`/?error=unauthorized`)
  }
}
