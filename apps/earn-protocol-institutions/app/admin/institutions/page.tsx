import { rootAdminValidateAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelInstitutions } from '@/features/admin/AdminPanelInstitutions'

export default async function InstitutionsAdminPage() {
  await rootAdminValidateAdminSession()

  return <AdminPanelInstitutions />
}
