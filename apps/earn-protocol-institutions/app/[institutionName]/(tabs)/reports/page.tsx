import { getCachedInstitutionData } from '@/app/server-handlers/institution/institution-data'
import { DashboardReports } from '@/features/dashboard/components/DashboardReports/DashboardReports'

export default async function InstitutionReportsTab({
  params,
}: {
  params: Promise<{ institutionName: string }>
}) {
  const { institutionName } = await params
  const _institution = await getCachedInstitutionData({ institutionName })

  return <DashboardReports />
}
