import { validateGlobalAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelInstitutions } from '@/features/admin/AdminPanelInstitutions'

export default async function InstitutionsAdminPage() {
  await validateGlobalAdminSession()

  return <AdminPanelInstitutions />
}
