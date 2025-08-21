import { validateGlobalAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelGlobalAdminsDelete } from '@/features/admin/AdminPanelGlobalAdminsDelete'

export default async function DeleteUserAdminPage({
  params,
}: {
  params: Promise<{
    userDbId: string
  }>
}) {
  await validateGlobalAdminSession()
  const [awaitedParams] = await Promise.all([params])

  return <AdminPanelGlobalAdminsDelete userDbId={awaitedParams.userDbId} />
}
