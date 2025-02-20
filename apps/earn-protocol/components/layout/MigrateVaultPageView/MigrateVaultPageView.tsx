'use client'
import { type FC } from 'react'
import {
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type UsersActivity,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'

import { MigrateVaultPageComponent } from './MigrateVaultPageComponent'

type MigrateVaultPageViewProps = {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  medianDefiYield?: number
}

export const MigrateVaultPageView: FC<MigrateVaultPageViewProps> = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
  medianDefiYield,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <MigrateVaultPageComponent
        vault={vault}
        vaults={vaults}
        userActivity={userActivity}
        topDepositors={topDepositors}
        medianDefiYield={medianDefiYield}
      />
    </SDKContextProvider>
  )
}
