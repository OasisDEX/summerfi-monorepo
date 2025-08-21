import { validateGlobalAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelUsersDelete } from '@/features/admin/AdminPanelUsersDelete'

export default async function DeleteUserAdminPage({
  params,
}: {
  params: Promise<{
    userDbId: string
  }>
}) {
  await validateGlobalAdminSession()
  const [awaitedParams] = await Promise.all([params])

  return <AdminPanelUsersDelete userDbId={awaitedParams.userDbId} />
}
