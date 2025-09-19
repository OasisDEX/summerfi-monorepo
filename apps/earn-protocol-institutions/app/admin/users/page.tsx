import { rootAdminValidateAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelUsers } from '@/features/admin/AdminPanelUsers'

export default async function UsersAdminPage() {
  await rootAdminValidateAdminSession()

  return <AdminPanelUsers />
}
