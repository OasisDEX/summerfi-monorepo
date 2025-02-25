'use client'
import { type FC } from 'react'
import {
  type ArksHistoricalChartData,
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type UsersActivity,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { sdkApiUrl } from '@/constants/sdk'

import { MigrateVaultPageComponent } from './MigrateVaultPageComponent'

type MigrateVaultPageViewProps = {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates?: { [key: string]: number }
  vaultApy?: number
  migratablePosition: MigratablePosition
}

export const MigrateVaultPageView: FC<MigrateVaultPageViewProps> = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApy,
  migratablePosition,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <MigrateVaultPageComponent
        vault={vault}
        vaults={vaults}
        userActivity={userActivity}
        topDepositors={topDepositors}
        medianDefiYield={medianDefiYield}
        arksHistoricalChartData={arksHistoricalChartData}
        arksInterestRates={arksInterestRates}
        vaultApy={vaultApy}
        migratablePosition={migratablePosition}
      />
    </SDKContextProvider>
  )
}
