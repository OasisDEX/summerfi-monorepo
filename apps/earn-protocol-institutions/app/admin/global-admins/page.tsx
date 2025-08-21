import { readSession } from '@/app/server-handlers/auth/session'
import { AdminPanelGlobalAdmins } from '@/features/admin/AdminPanelGlobalAdmins'

export default async function GlobalAdminsAdminPage() {
  const session = await readSession()

  if (!session || !session.user?.isGlobalAdmin) {
    throw new Error('Unauthorized')
  }

  return <AdminPanelGlobalAdmins />
}
