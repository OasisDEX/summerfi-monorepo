'use client'
import { type FC } from 'react'
import {
  type ArksHistoricalChartData,
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultsListType,
  type VaultApyData,
} from '@summerfi/app-types'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'

import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { type TokenPriceData } from '@/app/server-handlers/token-price/types'
import { sdkApiUrl } from '@/constants/sdk'

import { MigrationVaultPageComponent } from './MigrationVaultPageComponent'

type MigrationVaultPageViewProps = {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  vaultInfo?: IArmadaVaultInfo
  topDepositors: TopDepositorsPagination
  latestActivity: LatestActivityPagination
  rebalanceActivity: RebalanceActivityPagination
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  migratablePosition: MigratablePosition
  walletAddress: string
  sumrPrice: TokenPriceData
}

export const MigrationVaultPageView: FC<MigrationVaultPageViewProps> = ({
  vault,
  vaults,
  vaultInfo,
  latestActivity,
  topDepositors,
  rebalanceActivity,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  migratablePosition,
  walletAddress,
  sumrPrice,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <MigrationVaultPageComponent
        vault={vault}
        vaults={vaults}
        vaultInfo={vaultInfo}
        latestActivity={latestActivity}
        topDepositors={topDepositors}
        rebalanceActivity={rebalanceActivity}
        medianDefiYield={medianDefiYield}
        arksHistoricalChartData={arksHistoricalChartData}
        arksInterestRates={arksInterestRates}
        vaultApyData={vaultApyData}
        migratablePosition={migratablePosition}
        walletAddress={walletAddress}
        sumrPrice={sumrPrice}
      />
    </SDKContextProvider>
  )
}
