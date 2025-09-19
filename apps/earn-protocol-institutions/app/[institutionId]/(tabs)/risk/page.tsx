import { getInstitutionData } from '@/app/server-handlers/institution/institution-data'
import { DashboardRisk } from '@/features/dashboard/components/DashboardRisk/DashboardRisk'

export default async function InstitutionRiskTab({
  params,
}: {
  params: Promise<{ institutionId: string }>
}) {
  const { institutionId } = await params
  const _institution = await getInstitutionData(institutionId)

  return <DashboardRisk />
}
