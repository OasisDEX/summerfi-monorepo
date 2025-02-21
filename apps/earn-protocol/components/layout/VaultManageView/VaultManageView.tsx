'use client'

import {
  type ArksHistoricalChartData,
  type PerformanceChartData,
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type UsersActivity,
} from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { VaultManageViewComponent } from '@/components/layout/VaultManageView/VaultManageViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

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
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultManageViewComponent
        vault={vault}
        vaults={vaults}
        position={position}
        userActivity={userActivity}
        topDepositors={topDepositors}
        viewWalletAddress={viewWalletAddress}
        performanceChartData={performanceChartData}
        arksHistoricalChartData={arksHistoricalChartData}
        arksInterestRates={arksInterestRates}
      />
    </SDKContextProvider>
  )
}
