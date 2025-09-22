import { getInstitutionData } from '@/app/server-handlers/institution/institution-data'
import { DashboardFeesRevenue } from '@/features/dashboard/components/DashboardFeesRevenue/DashboardFeesRevenue'

export default async function InstitutionFeesRevenueTab({
  params,
}: {
  params: Promise<{ institutionName: string }>
}) {
  const { institutionName } = await params
  const _institution = await getInstitutionData(institutionName)

  return <DashboardFeesRevenue />
}
