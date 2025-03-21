'use client'

import {
  type ArksHistoricalChartData,
  type PerformanceChartData,
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type UsersActivity,
  type VaultApyData,
} from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { VaultManageViewComponent } from '@/components/layout/VaultManageView/VaultManageViewComponent'
import { sdkApiUrl } from '@/constants/sdk'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'

export const VaultManageView = ({
  vault,
  vaults,
  position,
  userActivity,
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
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
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
        userActivity={userActivity}
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
