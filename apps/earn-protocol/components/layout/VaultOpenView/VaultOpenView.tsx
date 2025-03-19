'use client'

import {
  type ArksHistoricalChartData,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type VaultApyData,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { type UsersActivitiesPagination } from '@/app/server-handlers/tables-data/users-activities/types'
import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { VaultOpenViewComponent } from '@/components/layout/VaultOpenView/VaultOpenViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

export const VaultOpenView = ({
  vault,
  vaults,
  usersActivities,
  topDepositors,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  vaultsApyRaw,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  usersActivities: UsersActivitiesPagination
  topDepositors: TopDepositorsPagination
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates?: { [key: string]: number }
  vaultApyData: VaultApyData
  vaultsApyRaw: GetVaultsApyResponse
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultOpenViewComponent
        vault={vault}
        vaults={vaults}
        usersActivities={usersActivities}
        topDepositors={topDepositors}
        medianDefiYield={medianDefiYield}
        arksHistoricalChartData={arksHistoricalChartData}
        arksInterestRates={arksInterestRates}
        vaultApyData={vaultApyData}
        vaultsApyRaw={vaultsApyRaw}
      />
    </SDKContextProvider>
  )
}
