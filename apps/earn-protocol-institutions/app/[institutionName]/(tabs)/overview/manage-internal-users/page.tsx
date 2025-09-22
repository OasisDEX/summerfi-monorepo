import { readSession } from '@/app/server-handlers/auth/session'
import { getInstitutionUsers } from '@/app/server-handlers/institution/institution-users'
import { PanelManageListInternalUsers } from '@/features/panels/overview/components/PanelManageInternalUsers/PanelManageListInternalUsers'

export default async function ManageInternalUsers({
  params,
}: {
  params: Promise<{ institutionName: string }>
}) {
  const [session, { institutionName }] = await Promise.all([readSession(), params])

  if (!session) {
    return <div>Please log in to view this page.</div>
  }

  if (!institutionName) {
    return <div>Institution ID not provided.</div>
  }
  const institutionUsersList = await getInstitutionUsers(institutionName)

  return (
    <PanelManageListInternalUsers
      users={institutionUsersList.users}
      institutionName={institutionName}
      session={session}
    />
  )
}
