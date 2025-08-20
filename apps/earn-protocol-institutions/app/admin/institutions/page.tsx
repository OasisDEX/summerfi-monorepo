import { readSession } from '@/app/server-handlers/auth/session'
import { AdminPanelInstitutions } from '@/features/admin/AdminPanelInstitutions'

export default async function InstitutionsAdminPage() {
  const session = await readSession()

  if (!session || !session.user?.isGlobalAdmin) {
    throw new Error('Unauthorized')
  }

  return <AdminPanelInstitutions />
}
