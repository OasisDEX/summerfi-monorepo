'use client'
import { type FC } from 'react'
import { type SDKGlobalRebalancesType, type SDKVaultishType } from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type PortfolioPositionsList } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { sdkApiUrl } from '@/constants/sdk'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

import { PortfolioPageView } from './PortfolioPageView'

interface PortfolioPageViewComponentProps {
  walletAddress: string
  walletData: PortfolioAssetsResponse
  rewardsData: ClaimDelegateExternalData
  vaultsList: SDKVaultishType[]
  positions: PortfolioPositionsList[]
  rebalancesList: SDKGlobalRebalancesType
  totalRays: number
}

export const PortfolioPageViewComponent: FC<PortfolioPageViewComponentProps> = ({
  walletAddress,
  walletData,
  rewardsData,
  vaultsList,
  positions,
  rebalancesList,
  totalRays,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <PortfolioPageView
        positions={positions}
        walletAddress={walletAddress}
        walletData={walletData}
        rewardsData={rewardsData}
        vaultsList={vaultsList}
        rebalancesList={rebalancesList}
        totalRays={totalRays}
      />
    </SDKContextProvider>
  )
}
