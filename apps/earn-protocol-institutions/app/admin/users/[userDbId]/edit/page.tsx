import { readSession } from '@/app/server-handlers/auth/session'
import { AdminPanelUsersUpdate } from '@/features/admin/AdminPanelUsersUpdate'

export default async function EditUserAdminPage({
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

  return <AdminPanelUsersUpdate userDbId={awaitedParams.userDbId} />
}
