'use client'

import { type SDKVaultishType, type SDKVaultsListType } from '@summerfi/app-types'
import { type IArmadaPosition, SDKContextProvider } from '@summerfi/sdk-client-react'

import { VaultManageViewComponent } from '@/components/layout/VaultManageView/VaultManageViewComponent'
import { sdkApiUrl } from '@/constants/sdk'

export const VaultManageView = ({
  vault,
  vaults,
  position,
  viewWalletAddress,
}: {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  viewWalletAddress: string
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultManageViewComponent
        vault={vault}
        vaults={vaults}
        position={position}
        viewWalletAddress={viewWalletAddress}
      />
    </SDKContextProvider>
  )
}
