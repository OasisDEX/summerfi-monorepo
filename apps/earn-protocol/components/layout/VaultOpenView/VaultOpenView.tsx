'use client'

import { type SDKVaultishType, type SDKVaultsListType } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { VaultOpenViewComponent } from '@/components/layout/VaultOpenView/VaultOpenViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

export const VaultOpenView = ({
  vault,
  vaults,
}: {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultOpenViewComponent vault={vault} vaults={vaults} />
    </SDKContextProvider>
  )
}
