'use client'

import {
  type ArksHistoricalChartData,
  type GetVaultsApyResponse,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { VaultOpenViewComponent } from '@/components/layout/VaultOpenView/VaultOpenViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

export const VaultOpenView = ({
  vault,
  vaults,
  latestActivity,
  topDepositors,
  rebalanceActivity,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  vaultsApyRaw,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  latestActivity: LatestActivityPagination
  topDepositors: TopDepositorsPagination
  rebalanceActivity: RebalanceActivityPagination
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: GetInterestRatesReturnType
  vaultApyData: VaultApyData
  vaultsApyRaw: GetVaultsApyResponse
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultOpenViewComponent
        vault={vault}
        vaults={vaults}
        latestActivity={latestActivity}
        topDepositors={topDepositors}
        rebalanceActivity={rebalanceActivity}
        medianDefiYield={medianDefiYield}
        arksHistoricalChartData={arksHistoricalChartData}
        arksInterestRates={arksInterestRates}
        vaultApyData={vaultApyData}
        vaultsApyRaw={vaultsApyRaw}
      />
    </SDKContextProvider>
  )
}
