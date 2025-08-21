import { readSession } from '@/app/server-handlers/auth/session'
import { AdminPanelGlobalAdminsDelete } from '@/features/admin/AdminPanelGlobalAdminsDelete'

export default async function DeleteUserAdminPage({
  params,
}: {
  params: Promise<{
    userDbId: string
  }>
}) {
  const [session, awaitedParams] = await Promise.all([readSession(), params])

  if (!session || !session.user?.isGlobalAdmin) {
    throw new Error('Unauthorized')
  }

  return <AdminPanelGlobalAdminsDelete userDbId={awaitedParams.userDbId} />
}
