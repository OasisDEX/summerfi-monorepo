import { rootAdminValidateAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelUsersUpdate } from '@/features/admin/AdminPanelUsersUpdate'

export default async function EditUserAdminPage({
  params,
}: {
  params: Promise<{
    userDbId: string
  }>
}) {
  await rootAdminValidateAdminSession()
  const [awaitedParams] = await Promise.all([params])

  return <AdminPanelUsersUpdate userDbId={awaitedParams.userDbId} />
}
