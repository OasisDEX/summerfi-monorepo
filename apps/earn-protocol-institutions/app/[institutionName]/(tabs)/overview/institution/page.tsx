import { getInstitutionVaults } from '@/app/server-handlers/institution/institution-vaults'
import { PanelInstitutionOverview } from '@/features/panels/overview/components/PanelInstitutionOverview/PanelInstitutionOverview'

export default async function InstitutionOverviewTab({
  params,
}: {
  params: Promise<{ institutionName: string }>
}) {
  const { institutionName } = await params

  if (!institutionName) {
    return <div>Institution ID not provided.</div>
  }
  const institutionVaults = await getInstitutionVaults({ institutionName })

  return (
    <PanelInstitutionOverview
      institutionName={institutionName}
      institutionVaults={institutionVaults?.vaults ?? []}
      vaultsAdditionalInfo={institutionVaults?.vaultsAdditionalInfo}
    />
  )
}
