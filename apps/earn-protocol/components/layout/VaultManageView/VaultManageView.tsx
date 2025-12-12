'use client'

import {
  type ArksHistoricalChartData,
  type EarnAppConfigType,
  type GetVaultsApyResponse,
  type IArmadaPosition,
  type InterestRates,
  type PerformanceChartData,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'

import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { VaultManageViewComponent } from '@/components/layout/VaultManageView/VaultManageViewComponent'
import { sdkApiUrl } from '@/constants/sdk'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'

export const VaultManageView = ({
  vault,
  vaultInfo,
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
  noOfDeposits,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaultInfo?: IArmadaVaultInfo
  vaults: SDKVaultsListType
  position: IArmadaPosition
  latestActivity: LatestActivityPagination
  topDepositors: TopDepositorsPagination
  rebalanceActivity: RebalanceActivityPagination
  viewWalletAddress: string
  performanceChartData: PerformanceChartData
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: InterestRates
  vaultsApyByNetworkMap: GetVaultsApyResponse
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
  systemConfig: Partial<EarnAppConfigType>
  noOfDeposits: number
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultManageViewComponent
        systemConfig={systemConfig}
        vault={vault}
        vaultInfo={vaultInfo}
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
        noOfDeposits={noOfDeposits}
      />
    </SDKContextProvider>
  )
}
