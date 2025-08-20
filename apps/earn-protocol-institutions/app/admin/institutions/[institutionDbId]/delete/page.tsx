import { readSession } from '@/app/server-handlers/auth/session'
import { AdminPanelInstitutionsDelete } from '@/features/admin/AdminPanelInstitutionsDelete'

export default async function EditInstitutionsAdminPage({
  params,
}: {
  params: Promise<{
    institutionDbId: string
  }>
}) {
  const [session, awaitedParams] = await Promise.all([readSession(), params])

  if (!session || !session.user?.isGlobalAdmin) {
    throw new Error('Unauthorized')
  }

  return <AdminPanelInstitutionsDelete institutionDbId={awaitedParams.institutionDbId} />
}
