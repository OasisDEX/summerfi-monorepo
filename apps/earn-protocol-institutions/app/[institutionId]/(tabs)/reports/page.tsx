import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { DashboardReports } from '@/features/dashboard/components/DashboardReports/DashboardReports'

export default async function InstitutionReportsTab({
  params,
}: {
  params: { institutionId: string }
}) {
  const { institutionId } = await params
  const _institution = await getInstitutionData(institutionId)

  return <DashboardReports />
}
