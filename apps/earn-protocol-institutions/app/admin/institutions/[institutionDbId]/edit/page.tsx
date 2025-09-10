import { validateGlobalAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelInstitutionsUpdate } from '@/features/admin/AdminPanelInstitutionsUpdate'

export default async function EditInstitutionsAdminPage({
  params,
}: {
  params: Promise<{
    institutionDbId: string
  }>
}) {
  await validateGlobalAdminSession()
  const [awaitedParams] = await Promise.all([params])

  return <AdminPanelInstitutionsUpdate institutionDbId={awaitedParams.institutionDbId} />
}
