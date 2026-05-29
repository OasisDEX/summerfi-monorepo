'use client'
import { type FC } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { VaultsListView } from '@/components/layout/VaultsListView/VaultsListView'
import { sdkApiUrl } from '@/constants/sdk'

interface VaultListViewComponentProps {
  walletAddress?: string
}

export const VaultListViewComponent: FC<VaultListViewComponentProps> = ({ walletAddress }) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultsListView walletAddress={walletAddress} />
    </SDKContextProvider>
  )
}
