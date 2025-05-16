'use client'
import { type FC } from 'react'
import {
  type GetVaultsApyResponse,
  type HistoryChartData,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { sdkApiUrl } from '@/constants/sdk'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'

import { PortfolioPageView } from './PortfolioPageView'

interface PortfolioPageViewComponentProps {
  walletAddress: string
  walletData: PortfolioAssetsResponse
  rewardsData: ClaimDelegateExternalData
  vaultsList: SDKVaultishType[]
  positions: PositionWithVault[]
  rebalanceActivity: RebalanceActivityPagination
  latestActivity: LatestActivityPagination
  totalRays: number
  positionsHistoricalChartMap: {
    [key: string]: HistoryChartData
  }
  vaultsApyByNetworkMap: GetVaultsApyResponse
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
}

export const PortfolioPageViewComponent: FC<PortfolioPageViewComponentProps> = ({
  walletAddress,
  walletData,
  rewardsData,
  vaultsList,
  positions,
  rebalanceActivity,
  latestActivity,
  totalRays,
  positionsHistoricalChartMap,
  vaultsApyByNetworkMap,
  migratablePositions,
  migrationBestVaultApy,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <PortfolioPageView
        positions={positions}
        walletAddress={walletAddress}
        walletData={walletData}
        rewardsData={rewardsData}
        vaultsList={vaultsList}
        rebalanceActivity={rebalanceActivity}
        latestActivity={latestActivity}
        totalRays={totalRays}
        positionsHistoricalChartMap={positionsHistoricalChartMap}
        vaultsApyByNetworkMap={vaultsApyByNetworkMap}
        migratablePositions={migratablePositions}
        migrationBestVaultApy={migrationBestVaultApy}
      />
    </SDKContextProvider>
  )
}
