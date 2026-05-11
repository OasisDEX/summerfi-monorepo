'use client'
import { type FC } from 'react'
import {
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultishType,
  type SingleSourceChartData,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'

import { PortfolioPageView } from './PortfolioPageView'

interface PortfolioPageViewComponentProps {
  viewWalletAddress: string
  vaultsList: SDKVaultishType[]
  positions: PositionWithVault[]
  positionsHistoricalChartMap: {
    [key: string]: SingleSourceChartData
  }
  vaultsApyByNetworkMap: GetVaultsApyResponse
  rewardTokenPrices: RewardTokenPrices
}

export const PortfolioPageViewComponent: FC<PortfolioPageViewComponentProps> = ({
  viewWalletAddress,
  vaultsList,
  positions,
  positionsHistoricalChartMap,
  vaultsApyByNetworkMap,
  rewardTokenPrices,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <PortfolioPageView
        positions={positions}
        viewWalletAddress={viewWalletAddress}
        vaultsList={vaultsList}
        positionsHistoricalChartMap={positionsHistoricalChartMap}
        vaultsApyByNetworkMap={vaultsApyByNetworkMap}
        rewardTokenPrices={rewardTokenPrices}
      />
    </SDKContextProvider>
  )
}
