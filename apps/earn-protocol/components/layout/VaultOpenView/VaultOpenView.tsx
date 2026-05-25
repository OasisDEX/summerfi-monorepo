'use client'

import {
  type ArksHistoricalChartData,
  type InterestRates,
  type RewardTokenPrices,
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
import { type VaultCurationEvent } from '@/features/curation-activity/types'

export const VaultOpenView = ({
  vault,
  vaults,
  vaultInfo,
  latestActivity,
  topDepositors,
  rebalanceActivity,
  curationEvents,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  // vaultsApyRaw,
  referralCode,
  rewardTokenPrices,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  vaultInfo?: IArmadaVaultInfo
  latestActivity: LatestActivityPagination
  topDepositors: TopDepositorsPagination
  rebalanceActivity: RebalanceActivityPagination
  curationEvents: VaultCurationEvent[]
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  // vaultsApyRaw: GetVaultsApyResponse
  referralCode?: string
  rewardTokenPrices: RewardTokenPrices
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
        curationEvents={curationEvents}
        medianDefiYield={medianDefiYield}
        arksHistoricalChartData={arksHistoricalChartData}
        arksInterestRates={arksInterestRates}
        vaultApyData={vaultApyData}
        // vaultsApyRaw={vaultsApyRaw}
        referralCode={referralCode}
        rewardTokenPrices={rewardTokenPrices}
      />
    </SDKContextProvider>
  )
}
