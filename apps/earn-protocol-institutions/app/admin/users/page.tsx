import { readSession } from '@/app/server-handlers/auth/session'
import { UsersAdminPanel } from '@/features/admin/UsersAdminPanel'

export default async function UsersAdminPage() {
  const session = await readSession()

  if (!session || !session.user.isGlobalAdmin) {
    throw new Error('Unauthorized')
  }

  return <UsersAdminPanel />
}
