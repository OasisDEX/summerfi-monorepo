import { readSession } from '@/app/server-handlers/auth/session'
import { getInstitutionUser } from '@/app/server-handlers/institution/institution-users'
import { PanelManageDeleteInternalUser } from '@/features/panels/overview/components/PanelManageInternalUsers/PanelManageDeleteInternalUser'

export default async function ManageInternalUsersDelete({
  params,
}: {
  params: Promise<{ institutionName: string; userDbId: string }>
}) {
  const [session, { institutionName, userDbId }] = await Promise.all([readSession(), params])

  if (!session) {
    return <div>Please log in to view this page.</div>
  }

  if (!userDbId) {
    return <div>User ID not provided.</div>
  }

  if (!institutionName) {
    return <div>Institution ID not provided.</div>
  }

  try {
    const { user } = await getInstitutionUser(institutionName, userDbId)

    return (
      <PanelManageDeleteInternalUser
        user={user}
        institutionName={institutionName}
        session={session}
      />
    )
  } catch (error) {
    return <div>Error loading user data: {(error as Error).message}</div>
  }
}
