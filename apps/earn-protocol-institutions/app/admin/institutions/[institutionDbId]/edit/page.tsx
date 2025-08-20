import { readSession } from '@/app/server-handlers/auth/session'
import { AdminPanelInstitutionsUpdate } from '@/features/admin/AdminPanelInstitutionsUpdate'

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

  return <AdminPanelInstitutionsUpdate institutionDbId={awaitedParams.institutionDbId} />
}
