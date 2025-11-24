import { PanelInstitutionOverview } from '@/features/panels/overview/components/PanelInstitutionOverview/PanelInstitutionOverview'

export default function InstitutionOverviewLoadingTab() {
  return (
    <PanelInstitutionOverview institutionName="Your institution" institutionVaults={[]} isLoading />
  )
}
