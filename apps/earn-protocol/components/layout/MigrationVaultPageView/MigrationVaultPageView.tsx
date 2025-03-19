'use client'
import { type FC } from 'react'
import {
  type ArksHistoricalChartData,
  type SDKVaultishType,
  type SDKVaultsListType,
  type VaultApyData,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { type UsersActivitiesPagination } from '@/app/server-handlers/tables-data/users-activities/types'
import { sdkApiUrl } from '@/constants/sdk'

import { MigrationVaultPageComponent } from './MigrationVaultPageComponent'

type MigrationVaultPageViewProps = {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  topDepositors: TopDepositorsPagination
  usersActivities: UsersActivitiesPagination
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
  usersActivities,
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
        usersActivities={usersActivities}
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
