'use client'

import {
  type ForecastData,
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type UsersActivity,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { VaultOpenViewComponent } from '@/components/layout/VaultOpenView/VaultOpenViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

export const VaultOpenView = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
  preloadedForecast,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  preloadedForecast?: ForecastData
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultOpenViewComponent
        vault={vault}
        vaults={vaults}
        userActivity={userActivity}
        topDepositors={topDepositors}
        preloadedForecast={preloadedForecast}
      />
    </SDKContextProvider>
  )
}
