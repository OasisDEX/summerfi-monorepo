'use client'

import {
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type UsersActivity,
} from '@summerfi/app-types'
import { type IArmadaPosition, SDKContextProvider } from '@summerfi/sdk-client-react'

import { VaultManageViewComponent } from '@/components/layout/VaultManageView/VaultManageViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

export const VaultManageView = ({
  vault,
  vaults,
  position,
  userActivity,
  topDepositors,
  viewWalletAddress,
}: {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  viewWalletAddress: string
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
      />
    </SDKContextProvider>
  )
}
