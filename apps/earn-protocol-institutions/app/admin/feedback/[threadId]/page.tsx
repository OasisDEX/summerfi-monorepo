import { rootAdminValidateAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelFeedbackList } from '@/features/admin/AdminPanelFeedbackList'

export default async function FeedbackEditAdminPage() {
  await rootAdminValidateAdminSession()

  return <AdminPanelFeedbackList />
}
