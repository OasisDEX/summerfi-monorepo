import { readSession } from '@/app/server-handlers/auth/session'
import { AdminPanelUsers } from '@/features/admin/AdminPanelUsers'

export default async function UsersAdminPage() {
  const session = await readSession()

  if (!session || !session.user?.isGlobalAdmin) {
    throw new Error('Unauthorized')
  }

  return <AdminPanelUsers />
}
