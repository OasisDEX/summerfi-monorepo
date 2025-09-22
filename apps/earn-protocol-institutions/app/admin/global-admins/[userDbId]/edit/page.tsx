import { rootAdminValidateAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelGlobalAdminsUpdate } from '@/features/admin/AdminPanelGlobalAdminsUpdate'

export default async function EditUserAdminPage({
  params,
}: {
  params: Promise<{
    userDbId: string
  }>
}) {
  await rootAdminValidateAdminSession()
  const [awaitedParams] = await Promise.all([params])

  return <AdminPanelGlobalAdminsUpdate userDbId={awaitedParams.userDbId} />
}
