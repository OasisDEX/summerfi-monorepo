import { supportedSDKNetwork, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import {
  getCachedInstitutionVaultPerformanceData,
  getCachedInstitutionVaults,
} from '@/app/server-handlers/institution/institution-vaults'
import { mapMultiVaultChartData } from '@/features/charts/mappers/mapMultiVaultChartData'
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

  const vaultsPerformanceDataMap = await Promise.all(
    institutionVaults.vaults.map(
      async (vault) =>
        await getCachedInstitutionVaultPerformanceData({
          vaultAddress: vault.id.toString(),
          network: supportedSDKNetwork(vault.protocol.network),
          institutionName,
        }),
    ),
  )

  const vaultsTvlChartData = mapMultiVaultChartData({
    institutionName,
    performanceDataArray: vaultsPerformanceDataMap.map((performanceData) => ({
      performanceData,
      pointName: 'netValue',
      currentPointValue: new BigNumber(performanceData.vault.inputTokenBalance)
        .div(ten.pow(performanceData.vault.inputToken.decimals))
        .toString(),
    })),
  })

  return (
    <PanelInstitutionOverview
      institutionName={institutionName}
      institutionVaults={institutionVaults.vaults}
      vaultsAdditionalInfo={institutionVaults.vaultsAdditionalInfo}
      vaultsTvlChartData={vaultsTvlChartData}
    />
  )
}
