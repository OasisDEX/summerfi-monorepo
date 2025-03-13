'use client'
import { type FC } from 'react'
import {
  type ArksHistoricalChartData,
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type UsersActivity,
  type VaultApyData,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { sdkApiUrl } from '@/constants/sdk'

import { MigrationVaultPageComponent } from './MigrationVaultPageComponent'

type MigrationVaultPageViewProps = {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates?: { [key: string]: number }
  vaultApyData: VaultApyData
  migratablePosition: MigratablePosition
  walletAddress: string
}

export const MigrationVaultPageView: FC<MigrationVaultPageViewProps> = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  migratablePosition,
  walletAddress,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <MigrationVaultPageComponent
        vault={vault}
        vaults={vaults}
        userActivity={userActivity}
        topDepositors={topDepositors}
        medianDefiYield={medianDefiYield}
        arksHistoricalChartData={arksHistoricalChartData}
        arksInterestRates={arksInterestRates}
        vaultApyData={vaultApyData}
        migratablePosition={migratablePosition}
        walletAddress={walletAddress}
      />
    </SDKContextProvider>
  )
}
