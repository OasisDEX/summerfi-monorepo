'use client'
import { type FC } from 'react'
import {
  type GetVaultsApyResponse,
  type SDKVaultishType,
  type SingleSourceChartData,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type PortfolioAssetsResponse } from '@/app/server-handlers/cached/get-wallet-assets/types'
import { type BeachClubData } from '@/app/server-handlers/raw-calls/beach-club/types'
import { type BlogPosts } from '@/app/server-handlers/raw-calls/blog-posts/types'
import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { type PortfolioSumrStakingV2Data } from '@/app/server-handlers/raw-calls/sumr-staking-v2/types'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { sdkApiUrl } from '@/constants/sdk'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'

import { PortfolioPageView } from './PortfolioPageView'

interface PortfolioPageViewComponentProps {
  viewWalletAddress: string
  walletData: PortfolioAssetsResponse
  rewardsData: ClaimDelegateExternalData
  vaultsList: SDKVaultishType[]
  positions: PositionWithVault[]
  rebalanceActivity: RebalanceActivityPagination
  latestActivity: LatestActivityPagination
  positionsHistoricalChartMap: {
    [key: string]: SingleSourceChartData
  }
  vaultsApyByNetworkMap: GetVaultsApyResponse
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
  beachClubData: BeachClubData
  blogPosts: BlogPosts
  portfolioSumrStakingV2Data: PortfolioSumrStakingV2Data
  sumrPriceUsd: number
}

export const PortfolioPageViewComponent: FC<PortfolioPageViewComponentProps> = ({
  viewWalletAddress,
  walletData,
  rewardsData,
  vaultsList,
  positions,
  rebalanceActivity,
  latestActivity,
  positionsHistoricalChartMap,
  vaultsApyByNetworkMap,
  migratablePositions,
  migrationBestVaultApy,
  beachClubData,
  blogPosts,
  portfolioSumrStakingV2Data,
  sumrPriceUsd,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <PortfolioPageView
        positions={positions}
        viewWalletAddress={viewWalletAddress}
        walletData={walletData}
        rewardsData={rewardsData}
        vaultsList={vaultsList}
        rebalanceActivity={rebalanceActivity}
        latestActivity={latestActivity}
        positionsHistoricalChartMap={positionsHistoricalChartMap}
        vaultsApyByNetworkMap={vaultsApyByNetworkMap}
        migratablePositions={migratablePositions}
        migrationBestVaultApy={migrationBestVaultApy}
        beachClubData={beachClubData}
        blogPosts={blogPosts}
        portfolioSumrStakingV2Data={portfolioSumrStakingV2Data}
        sumrPriceUsd={sumrPriceUsd}
      />
    </SDKContextProvider>
  )
}
