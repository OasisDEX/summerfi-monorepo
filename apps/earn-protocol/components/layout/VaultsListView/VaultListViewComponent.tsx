'use client'
import { type FC } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import dynamic from 'next/dynamic'

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
  walletAddress?: string
}

export const VaultListViewComponent: FC<VaultListViewComponentProps> = ({ walletAddress }) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultsListView walletAddress={walletAddress} />
    </SDKContextProvider>
  )
}
