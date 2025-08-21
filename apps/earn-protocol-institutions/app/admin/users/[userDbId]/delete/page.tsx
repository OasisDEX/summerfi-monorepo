import { readSession } from '@/app/server-handlers/auth/session'
import { AdminPanelUsersDelete } from '@/features/admin/AdminPanelUsersDelete'

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

  return <AdminPanelUsersDelete userDbId={awaitedParams.userDbId} />
}
