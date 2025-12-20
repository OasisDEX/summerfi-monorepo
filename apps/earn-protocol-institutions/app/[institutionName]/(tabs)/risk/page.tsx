import { getCachedInstitutionData } from '@/app/server-handlers/institution/institution-data'
import { DashboardRisk } from '@/features/dashboard/components/DashboardRisk/DashboardRisk'

export default async function InstitutionRiskTab({
  params,
}: {
  params: Promise<{ institutionName: string }>
}) {
  const { institutionName } = await params
  const _institution = await getCachedInstitutionData({ institutionName })

  return <DashboardRisk />
}
