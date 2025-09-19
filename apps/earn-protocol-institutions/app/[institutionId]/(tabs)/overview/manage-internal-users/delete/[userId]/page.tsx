import { readSession } from '@/app/server-handlers/auth/session'
import { getInstitutionUser } from '@/app/server-handlers/institution/institution-users'
import { PanelManageDeleteInternalUser } from '@/features/panels/overview/components/PanelManageInternalUsers/PanelManageDeleteInternalUser'

export default async function ManageInternalUsersDelete({
  params,
}: {
  params: Promise<{ institutionId: string; userId: string }>
}) {
  const [session, { institutionId, userId }] = await Promise.all([readSession(), params])

  if (!session) {
    return <div>Please log in to view this page.</div>
  }

  if (!userId) {
    return <div>User ID not provided.</div>
  }

  if (!institutionId) {
    return <div>Institution ID not provided.</div>
  }
  const institutionUsersList = await getInstitutionUser(institutionId, userId)

  return (
    <PanelManageDeleteInternalUser
      user={institutionUsersList.user}
      institutionId={institutionId}
      session={session}
    />
  )
}
