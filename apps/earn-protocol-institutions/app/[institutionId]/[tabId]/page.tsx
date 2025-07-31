import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { DashboardFeesRevenue } from '@/features/dashboard/components/DashboardFeesRevenue/DashboardFeesRevenue'
import { DashboardNews } from '@/features/dashboard/components/DashboardNews/DashboardNews'
import { DashboardOverview } from '@/features/dashboard/components/DashboardOverview/DashboardOverview'
import { DashboardReports } from '@/features/dashboard/components/DashboardReports/DashboardReports'
import { DashboardRisk } from '@/features/dashboard/components/DashboardRisk/DashboardRisk'
import { DashboardVaults } from '@/features/dashboard/components/DashboardVaults/DashboardVaults'

export default async function InstitutionPage({
  params,
}: {
  params: { institutionId: string; tabId: string }
}) {
  const institution = await getInstitutionData(params.institutionId)

  switch (params.tabId) {
    case 'overview':
      return <DashboardOverview />
    case 'vaults':
      return <DashboardVaults vaultData={institution.vaultData} />
    case 'risk':
      return <DashboardRisk />
    case 'fees-revenue':
      return <DashboardFeesRevenue />
    case 'reports':
      return <DashboardReports />
    case 'news':
      return <DashboardNews />
    default:
      return <div>Wrong tab</div>
  }
}
