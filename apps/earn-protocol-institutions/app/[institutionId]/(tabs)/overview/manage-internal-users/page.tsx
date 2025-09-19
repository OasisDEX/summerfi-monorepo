import { readSession } from '@/app/server-handlers/auth/session'
import { getInstitutionUsers } from '@/app/server-handlers/institution/institution-users'
import { PanelManageListInternalUsers } from '@/features/panels/overview/components/PanelManageInternalUsers/PanelManageListInternalUsers'

export default async function ManageInternalUsers({
  params,
}: {
  params: Promise<{ institutionId: string }>
}) {
  const [session, { institutionId }] = await Promise.all([readSession(), params])

  if (!session) {
    return <div>Please log in to view this page.</div>
  }

  if (!institutionId) {
    return <div>Institution ID not provided.</div>
  }
  const institutionUsersList = await getInstitutionUsers(institutionId)

  return (
    <PanelManageListInternalUsers
      users={institutionUsersList.users}
      institutionId={institutionId}
      session={session}
    />
  )
}
