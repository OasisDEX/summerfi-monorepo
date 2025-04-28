'use client'
import { type FC } from 'react'
import { type SDKNetwork, type SDKVaultsListType } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import dynamic from 'next/dynamic'

import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { VaultsListViewLoading } from '@/components/layout/VaultsListView/VaultsListViewLoading'
import { sdkApiUrl } from '@/constants/sdk'

const VaultsListView = dynamic(
  () =>
    import('@/components/layout/VaultsListView/VaultsListView').then((mod) => mod.VaultsListView),
  {
    ssr: false,
    loading: () => <VaultsListViewLoading />,
  },
)

interface VaultListViewComponentProps {
  vaultsList: SDKVaultsListType
  selectedNetwork?: SDKNetwork | 'all-networks'
  vaultsApyByNetworkMap: GetVaultsApyResponse
}

export const VaultListViewComponent: FC<VaultListViewComponentProps> = ({
  vaultsList,
  selectedNetwork,
  vaultsApyByNetworkMap,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultsListView
        vaultsList={vaultsList}
        selectedNetwork={selectedNetwork}
        vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      />
    </SDKContextProvider>
  )
}
