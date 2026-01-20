'use client'

import {
  type ArksHistoricalChartData,
  type GetVaultsApyResponse,
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'

import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { VaultOpenViewComponent } from '@/components/layout/VaultOpenView/VaultOpenViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

export const VaultOpenView = ({
  vault,
  vaults,
  vaultInfo,
  latestActivity,
  topDepositors,
  rebalanceActivity,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  vaultsApyRaw,
  referralCode,
  sumrPriceUsd,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  vaultInfo?: IArmadaVaultInfo
  latestActivity: LatestActivityPagination
  topDepositors: TopDepositorsPagination
  rebalanceActivity: RebalanceActivityPagination
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  vaultsApyRaw: GetVaultsApyResponse
  referralCode?: string
  sumrPriceUsd: number
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultOpenViewComponent
        vault={vault}
        vaults={vaults}
        vaultInfo={vaultInfo}
        latestActivity={latestActivity}
        topDepositors={topDepositors}
        rebalanceActivity={rebalanceActivity}
        medianDefiYield={medianDefiYield}
        arksHistoricalChartData={arksHistoricalChartData}
        arksInterestRates={arksInterestRates}
        vaultApyData={vaultApyData}
        vaultsApyRaw={vaultsApyRaw}
        referralCode={referralCode}
        sumrPriceUsd={sumrPriceUsd}
      />
    </SDKContextProvider>
  )
}
