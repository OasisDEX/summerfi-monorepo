import { validateGlobalAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelUsers } from '@/features/admin/AdminPanelUsers'

export default async function UsersAdminPage() {
  await validateGlobalAdminSession()

  return <AdminPanelUsers />
}
