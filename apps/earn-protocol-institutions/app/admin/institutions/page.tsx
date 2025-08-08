import { readSession } from '@/app/server-handlers/auth/session'
import { InstitutionsAdminPanel } from '@/features/admin/InstitutionsAdminPanel'

export default async function AdminPage() {
  const session = await readSession()

  if (!session || !session.user.isGlobalAdmin) {
    throw new Error('Unauthorized')
  }

  return <InstitutionsAdminPanel />
}
