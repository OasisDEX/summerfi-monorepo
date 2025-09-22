import { getInstitutionUsers } from '@/app/server-handlers/institution/institution-users'

export default async function InstitutionOverviewTab({
  params,
}: {
  params: Promise<{ institutionName: string }>
}) {
  const { institutionName } = await params

  if (!institutionName) {
    return <div>Institution ID not provided.</div>
  }
  const institutionUsersList = await getInstitutionUsers(institutionName)

  return <div>Users count: {JSON.stringify(institutionUsersList.users.length)}</div>
}
