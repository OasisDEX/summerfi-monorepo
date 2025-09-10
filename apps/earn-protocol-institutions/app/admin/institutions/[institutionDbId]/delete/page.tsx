import { validateGlobalAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelInstitutionsDelete } from '@/features/admin/AdminPanelInstitutionsDelete'

export default async function DeleteInstitutionAdminPage({
  params,
}: {
  params: Promise<{
    institutionDbId: string
  }>
}) {
  await validateGlobalAdminSession()
  const [awaitedParams] = await Promise.all([params])

  return <AdminPanelInstitutionsDelete institutionDbId={awaitedParams.institutionDbId} />
}
