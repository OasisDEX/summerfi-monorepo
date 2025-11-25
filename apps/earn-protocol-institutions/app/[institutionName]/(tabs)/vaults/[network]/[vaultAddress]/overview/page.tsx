import { humanNetworktoSDKNetwork, subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { getInstitutionVaultPerformanceData } from '@/app/server-handlers/institution/institution-vaults'
import { getInstitutionsSDK } from '@/app/server-handlers/sdk'
import { mapNavChartData } from '@/features/charts/mappers/mapNavChartData'
import { PanelOverview } from '@/features/panels/vaults/components/PanelOverview/PanelOverview'

export default async function InstitutionVaultOverviewPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const institutionSdk = getInstitutionsSDK(institutionName)
  const chainId = subgraphNetworkToId(parsedNetwork)
  const chainInfo = getChainInfoByChainId(chainId)
  const fleetAddress = Address.createFromEthereum({
    value: vaultAddress,
  })

  const vaultId = ArmadaVaultId.createFrom({
    chainInfo,
    fleetAddress,
  })

  const [performanceData, vaultInfo] = await Promise.all([
    getInstitutionVaultPerformanceData({
      fleetCommanderAddress: vaultAddress,
      network: parsedNetwork,
    }),
    institutionSdk.armada.users.getVaultInfo({
      vaultId,
    }),
  ])

  const navChartData = mapNavChartData({ performanceData, currentNavPrice: vaultInfo.sharePrice })

  return <PanelOverview navChartData={navChartData} />
}
