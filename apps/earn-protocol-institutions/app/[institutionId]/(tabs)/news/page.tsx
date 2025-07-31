import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { DashboardNews } from '@/features/dashboard/components/DashboardNews/DashboardNews'

export default async function InstitutionNewsTab({
  params,
}: {
  params: Promise<{ institutionId: string }>
}) {
  const { institutionId } = await params
  const _institution = await getInstitutionData(institutionId)

  return <DashboardNews />
}
