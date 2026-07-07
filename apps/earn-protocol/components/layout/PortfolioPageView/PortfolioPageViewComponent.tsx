'use client'
import { type FC } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { PortfolioPageViewLoadingState } from '@/components/layout/PortfolioPageView/PortfolioPageViewLoadingState'
import { sdkApiUrl } from '@/constants/sdk'
import { usePortfolioCoreDataQuery } from '@/features/portfolio/api/get-portfolio-core-data'

import { PortfolioPageView } from './PortfolioPageView'

interface PortfolioPageViewComponentProps {
  viewWalletAddress: string
}

export const PortfolioPageViewComponent: FC<PortfolioPageViewComponentProps> = ({
  viewWalletAddress,
}) => {
  // Reads straight from the server-hydrated cache on first render; only ever hits the API route
  // fallback if the prefetch failed to dehydrate (then the loading state covers the gap).
  const { data, isPending } = usePortfolioCoreDataQuery(viewWalletAddress)

  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      {isPending || !data ? (
        <PortfolioPageViewLoadingState />
      ) : (
        <PortfolioPageView
          positions={data.positions}
          viewWalletAddress={viewWalletAddress}
          vaultsList={data.vaultsList}
          vaultsApyByNetworkMap={data.vaultsApyByNetworkMap}
          rewardTokenPrices={data.rewardTokenPrices}
        />
      )}
    </SDKContextProvider>
  )
}
