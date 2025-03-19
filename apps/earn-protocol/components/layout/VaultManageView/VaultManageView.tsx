'use client'

import {
  type ArksHistoricalChartData,
  type PerformanceChartData,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { type UsersActivitiesPagination } from '@/app/server-handlers/tables-data/users-activities/types'
import { VaultManageViewComponent } from '@/components/layout/VaultManageView/VaultManageViewComponent'
import { sdkApiUrl } from '@/constants/sdk'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'

export const VaultManageView = ({
  vault,
  vaults,
  position,
  userActivities,
  topDepositors,
  viewWalletAddress,
  performanceChartData,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  migratablePositions,
  migrationBestVaultApy,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  userActivities: UsersActivitiesPagination
  topDepositors: TopDepositorsPagination
  viewWalletAddress: string
  performanceChartData: PerformanceChartData
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates?: { [key: string]: number }
  vaultApyData: VaultApyData
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultManageViewComponent
        vault={vault}
        vaultApyData={vaultApyData}
        vaults={vaults}
        position={position}
        userActivities={userActivities}
        topDepositors={topDepositors}
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
