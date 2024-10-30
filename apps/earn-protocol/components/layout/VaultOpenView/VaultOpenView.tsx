'use client'

import {
  type SDKRebalancesType,
  type SDKVaultishType,
  type SDKVaultsListType,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { VaultOpenViewComponent } from '@/components/layout/VaultOpenView/VaultOpenViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

export const VaultOpenView = ({
  vault,
  vaults,
  rebalances,
}: {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  rebalances: SDKRebalancesType
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultOpenViewComponent vault={vault} vaults={vaults} rebalancesList={rebalances} />
    </SDKContextProvider>
  )
}
