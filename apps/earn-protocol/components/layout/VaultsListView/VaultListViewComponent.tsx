'use client'
import { type FC } from 'react'
import { type SDKVaultsListType } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { VaultsListView } from '@/components/layout/VaultsListView/VaultsListView'
import { sdkApiUrl } from '@/constants/sdk'

interface VaultManageViewComponentProps {
  vaultsList: SDKVaultsListType
}

export const VaultManageViewComponent: FC<VaultManageViewComponentProps> = ({ vaultsList }) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultsListView vaultsList={vaultsList} />
    </SDKContextProvider>
  )
}
