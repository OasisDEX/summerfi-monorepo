import { readSession } from '@/app/server-handlers/auth/session'
import { getInstitutionUser } from '@/app/server-handlers/institution/institution-users'
import { PanelManageEditInternalUser } from '@/features/panels/overview/components/PanelManageInternalUsers/PanelManageEditInternalUser'

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
  const institutionUsersList = await getInstitutionUser(institutionName, userDbId)

  return (
    <PanelManageEditInternalUser
      user={institutionUsersList.user}
      institutionName={institutionName}
      session={session}
    />
  )
}
