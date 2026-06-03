import { getCachedInstitutionVaults } from '@/app/server-handlers/institution/institution-vaults'
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
  const institutionVaults = await getCachedInstitutionVaults({ institutionName })

  if (!institutionVaults || institutionVaults.vaults.length === 0) {
    return <div>No vaults found for this institution.</div>
  }

  // The vault table renders immediately from the (tab-layout-cached) vault list. The multi-vault
  // TVL chart — which needs one heavy performance fetch per vault — is deferred to a client query
  // gated on scroll-into-view (LazyTvlChart), so this page no longer blocks on that O(n) waterfall.
  return (
    <PanelInstitutionOverview
      institutionName={institutionName}
      institutionVaults={institutionVaults.vaults}
      vaultsAdditionalInfo={institutionVaults.vaultsAdditionalInfo}
    />
  )
}
