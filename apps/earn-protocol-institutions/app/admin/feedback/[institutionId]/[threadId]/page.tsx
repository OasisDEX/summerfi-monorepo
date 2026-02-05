import { rootAdminValidateAdminSession } from '@/app/server-handlers/admin/validate-admin-session'
import { AdminPanelFeedbackView } from '@/features/admin/AdminPanelFeedbackView'

export default async function FeedbackEditAdminPage({
  params,
}: {
  params: Promise<{
    threadId: string
    institutionId: string
  }>
}) {
  await rootAdminValidateAdminSession()
  const [awaitedParams] = await Promise.all([params])

  return (
    <AdminPanelFeedbackView
      threadId={awaitedParams.threadId}
      institutionId={awaitedParams.institutionId}
    />
  )
}
