import { getInstitutionData } from '@/app/server-handlers/institution/institution-data'
import { DashboardNews } from '@/features/dashboard/components/DashboardNews/DashboardNews'

export default async function InstitutionNewsTab({
  params,
}: {
  params: Promise<{ institutionId: string }>
}) {
  const { institutionId } = await params
  const _institution = await getInstitutionData(institutionId)
  // simulate loading state
  // eslint-disable-next-line no-promise-executor-return
  const _dummy = await new Promise((resolve) => setTimeout(resolve, 1000))

  return <DashboardNews />
}
