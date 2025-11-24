import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getInstitutionVaultPerformanceData } from '@/app/server-handlers/institution/institution-vaults'
import { PanelOverview } from '@/features/panels/vaults/components/PanelOverview/PanelOverview'

export default async function InstitutionVaultOverviewPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)

  const performanceChartData = await getInstitutionVaultPerformanceData({
    fleetCommanderAddress: vaultAddress,
    network: parsedNetwork,
  })

  return <PanelOverview />
}
