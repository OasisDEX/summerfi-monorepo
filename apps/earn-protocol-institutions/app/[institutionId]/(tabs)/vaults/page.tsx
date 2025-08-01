import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { DashboardVaults } from '@/features/dashboard/components/DashboardVaults/DashboardVaults'

export default async function InstitutionVaultsTab({
  params,
}: {
  params: Promise<{ institutionId: string }>
}) {
  const { institutionId } = await params
  const institution = await getInstitutionData(institutionId)

  return <DashboardVaults vaultsData={institution.vaultsData} />
}
