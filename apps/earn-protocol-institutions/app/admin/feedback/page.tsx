import { rootAdminValidateAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelFeedbackList } from '@/features/admin/AdminPanelFeedbackList'

export default async function FeedbackAdminPage() {
  await rootAdminValidateAdminSession()

  return <AdminPanelFeedbackList />
}
