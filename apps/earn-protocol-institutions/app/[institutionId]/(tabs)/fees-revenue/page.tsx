import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { DashboardFeesRevenue } from '@/features/dashboard/components/DashboardFeesRevenue/DashboardFeesRevenue'

export default async function InstitutionFeesRevenueTab({
  params,
}: {
  params: { institutionId: string }
}) {
  const { institutionId } = await params
  const _institution = await getInstitutionData(institutionId)

  return <DashboardFeesRevenue />
}
