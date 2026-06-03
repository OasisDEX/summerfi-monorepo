import { type MultipleSourceChartData } from '@summerfi/app-types'
import { supportedSDKNetwork, ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import {
  getCachedInstitutionVaultPerformanceData,
  getCachedInstitutionVaults,
} from '@/app/server-handlers/institution/institution-vaults'
import { mapMultiVaultChartData } from '@/features/charts/mappers/mapMultiVaultChartData'

// The multi-vault TVL chart needs one (heavy) performance-data fetch PER vault. This used to run
// inline in the institution overview page, blocking the whole page on an O(n) waterfall before the
// vault table could paint. It now lives behind its own route so the table renders immediately and
// the chart is fetched client-side once it scrolls into view (see LazyTvlChart).
export const getInstitutionTvlChartData = async ({
  institutionName,
}: {
  institutionName: string
}): Promise<MultipleSourceChartData | null> => {
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

  return mapMultiVaultChartData({
    institutionName,
    performanceDataArray: vaultsPerformanceDataMap.map((performanceData) => ({
      performanceData,
      pointName: 'netValue',
      currentPointValue: new BigNumber(performanceData.vault.inputTokenBalance)
        .div(ten.pow(performanceData.vault.inputToken.decimals))
        .toString(),
    })),
  })
}
