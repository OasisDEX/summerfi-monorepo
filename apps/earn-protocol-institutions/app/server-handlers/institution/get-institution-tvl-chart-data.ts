import { type MultipleSourceChartData } from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import {
  getCachedInstitutionVaultPerformanceData,
  getCachedInstitutionVaults,
} from '@/app/server-handlers/institution/institution-vaults'
import { mapMultiVaultChartData } from '@/features/charts/mappers/mapMultiVaultChartData'

export type InstitutionOverviewChartData = {
  tvlChartData: MultipleSourceChartData
  navChartData: MultipleSourceChartData
}

// The multi-vault TVL chart needs one (heavy) performance-data fetch PER vault. This used to run
// inline in the institution overview page, blocking the whole page on an O(n) waterfall before the
// vault table could paint. It now lives behind its own route so the table renders immediately and
// both charts (TVL and multi-vault NAV price) are fetched client-side once the card scrolls into
// view (see LazyTvlChart).
export const getInstitutionTvlChartData = async ({
  institutionName,
}: {
  institutionName: string
}): Promise<InstitutionOverviewChartData | null> => {
  const institutionVaults = await getCachedInstitutionVaults({ institutionName })

  if (!institutionVaults || institutionVaults.vaults.length === 0) {
    return null
  }

  const vaultsPerformanceDataMap = await Promise.all(
    institutionVaults.vaults.map((vault) =>
      getCachedInstitutionVaultPerformanceData({
        vaultAddress: vault.id.toString(),
        network: supportedSDKNetwork(vault.protocol.network),
        institutionName,
      }),
    ),
  )

  const { vaultSharePriceMap } = institutionVaults.vaultsAdditionalInfo

  const tvlChartData = mapMultiVaultChartData({
    institutionName,
    performanceDataArray: vaultsPerformanceDataMap.map((performanceData) => ({
      performanceData,
      pointName: 'netValue',
      currentPointValue: new BigNumber(performanceData.vault.inputTokenBalance)
        .div(ten.pow(performanceData.vault.inputToken.decimals))
        .toString(),
    })),
  })

  const navChartData = mapMultiVaultChartData({
    institutionName,
    performanceDataArray: vaultsPerformanceDataMap.map((performanceData) => {
      const chainId = subgraphNetworkToId(
        supportedSDKNetwork(performanceData.vault.protocol.network),
      )
      const vaultSelector = `${performanceData.vault.id.toLowerCase()}-${chainId}`
      const sharePrice =
        vaultSelector in vaultSharePriceMap ? vaultSharePriceMap[vaultSelector] : undefined
      // Fall back to the most recent history point's navPrice if share price not in map
      const lastPoint =
        performanceData.vault.hourlyVaultHistory[
          performanceData.vault.hourlyVaultHistory.length - 1
        ]

      return {
        performanceData,
        pointName: 'navPrice',
        currentPointValue: sharePrice ?? lastPoint.navPrice,
      }
    }),
  })

  return { tvlChartData, navChartData }
}
