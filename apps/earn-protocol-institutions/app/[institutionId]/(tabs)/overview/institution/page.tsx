import { getInstitutionUsers } from '@/app/server-handlers/institution/institution-users'

export default async function InstitutionOverviewTab({
  params,
}: {
  params: Promise<{ institutionId: string }>
}) {
  const { institutionId } = await params

  if (!institutionId) {
    return <div>Institution ID not provided.</div>
  }
  const institutionUsersList = await getInstitutionUsers(institutionId)

  return <div>Users count: {JSON.stringify(institutionUsersList.users.length)}</div>
}
