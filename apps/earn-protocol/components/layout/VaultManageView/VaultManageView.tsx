'use client'

import {
  type ArksHistoricalChartData,
  type EarnAppConfigType,
  type IArmadaPosition,
  type PerformanceChartData,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { VaultManageViewComponent } from '@/components/layout/VaultManageView/VaultManageViewComponent'
import { sdkApiUrl } from '@/constants/sdk'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'

export const VaultManageView = ({
  vault,
  vaults,
  position,
  latestActivity,
  topDepositors,
  rebalanceActivity,
  viewWalletAddress,
  performanceChartData,
  arksHistoricalChartData,
  arksInterestRates,
  vaultsApyByNetworkMap,
  migratablePositions,
  migrationBestVaultApy,
  systemConfig,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  latestActivity: LatestActivityPagination
  topDepositors: TopDepositorsPagination
  rebalanceActivity: RebalanceActivityPagination
  viewWalletAddress: string
  performanceChartData: PerformanceChartData
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: GetInterestRatesReturnType
  vaultsApyByNetworkMap: GetVaultsApyResponse
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
  systemConfig: Partial<EarnAppConfigType>
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultManageViewComponent
        systemConfig={systemConfig}
        vault={vault}
        vaults={vaults}
        vaultsApyByNetworkMap={vaultsApyByNetworkMap}
        position={position}
        latestActivity={latestActivity}
        topDepositors={topDepositors}
        rebalanceActivity={rebalanceActivity}
        viewWalletAddress={viewWalletAddress}
        performanceChartData={performanceChartData}
        arksHistoricalChartData={arksHistoricalChartData}
        arksInterestRates={arksInterestRates}
        migratablePositions={migratablePositions}
        migrationBestVaultApy={migrationBestVaultApy}
      />
    </SDKContextProvider>
  )
}
