'use client'
import { type FC } from 'react'
import { type SDKNetwork, type SDKVaultsListType } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { VaultsListView } from '@/components/layout/VaultsListView/VaultsListView'
import { sdkApiUrl } from '@/constants/sdk'

interface VaultListViewComponentProps {
  vaultsList: SDKVaultsListType
  selectedNetwork?: SDKNetwork | 'all-networks'
}

export const VaultListViewComponent: FC<VaultListViewComponentProps> = ({
  vaultsList,
  selectedNetwork,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultsListView vaultsList={vaultsList} selectedNetwork={selectedNetwork} />
    </SDKContextProvider>
  )
}
