import { validateGlobalAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelGlobalAdmins } from '@/features/admin/AdminPanelGlobalAdmins'

export default async function GlobalAdminsAdminPage() {
  await validateGlobalAdminSession()

  return <AdminPanelGlobalAdmins />
}
