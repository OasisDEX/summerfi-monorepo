'use client'
import { type FC } from 'react'
import {
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultsListType,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'
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
  vaultsList: SDKVaultsListType
  filteredWalletAssetsVaults: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
  vaultsInfo?: IArmadaVaultInfo[]
  sumrPriceUsd: number
  rewardTokenPrices: RewardTokenPrices
  tvl: number
}

export const VaultListViewComponent: FC<VaultListViewComponentProps> = ({
  vaultsList,
  filteredWalletAssetsVaults,
  vaultsApyByNetworkMap,
  vaultsInfo,
  sumrPriceUsd,
  rewardTokenPrices,
  tvl,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultsListView
        vaultsList={vaultsList}
        filteredWalletAssetsVaults={filteredWalletAssetsVaults}
        vaultsApyByNetworkMap={vaultsApyByNetworkMap}
        vaultsInfo={vaultsInfo}
        sumrPriceUsd={sumrPriceUsd}
        rewardTokenPrices={rewardTokenPrices}
        tvl={tvl}
      />
    </SDKContextProvider>
  )
}
