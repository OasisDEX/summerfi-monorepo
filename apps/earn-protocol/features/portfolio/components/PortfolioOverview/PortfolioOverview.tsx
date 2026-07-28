import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  DataBlock,
  getPositionValues,
  PortfolioPosition,
  SkeletonLine,
  TabBarSimple,
  Text,
  Timeframes,
  ToggleButton,
  useLocalStorage,
  useMobileCheck,
} from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultsListType,
  SupportedSDKNetworks,
  type TimeframesType,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatFiatBalance,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import Link from 'next/link'

import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { NewsAndUpdates } from '@/features/news-and-updates/components/NewsAndUpdates/NewsAndUpdates'
import { usePortfolioPositionHistoryQuery } from '@/features/portfolio/api/get-portfolio-position-history-data'
import { LazyPositionHistoryChart } from '@/features/portfolio/components/PortfolioOverview/LazyPositionHistoryChart'
import { PortfolioVaultsCarousel } from '@/features/portfolio/components/PortfolioVaultsCarousel/PortfolioVaultsCarousel'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { calculateOverallSumr } from '@/helpers/calculate-overall-sumr'
import {
  allTimeframesAvailable,
  allTimeframesNotAvailable,
  useTimeframes,
} from '@/hooks/use-timeframes'

import portfolioOverviewStyles from './PortfolioOverview.module.css'

type PortfolioOverviewProps = {
  vaultsList: SDKVaultsListType
  positions: PositionWithVault[] | []
  rewardsData: ClaimDelegateExternalData
  isRewardsDataPending: boolean
  vaultsApyByNetworkMap: GetVaultsApyResponse
  rewardTokenPrices: RewardTokenPrices
  viewWalletAddress: string
}

const PositionsListView = ({
  sortedPositions,
  walletAddress,
  vaultsApyByNetworkMap,
  rewardTokenPrices,
  timeframe,
  isMobile,
  isTablet,
}: {
  sortedPositions: PositionWithVault[]
  walletAddress: string
  vaultsApyByNetworkMap: GetVaultsApyResponse
  rewardTokenPrices: RewardTokenPrices
  timeframe: TimeframesType
  isMobile: boolean
  isTablet: boolean
}) => {
  return sortedPositions.length ? (
    sortedPositions.map((position) => (
      <PortfolioPosition
        isMobile={isMobile || isTablet}
        key={`Position_${position.position.id.id}_${position.vault.protocol.network}`}
        portfolioPosition={position}
        positionGraph={
          <LazyPositionHistoryChart
            walletAddress={walletAddress}
            position={position}
            timeframe={timeframe}
          />
        }
        vaultApyData={
          vaultsApyByNetworkMap[
            `${position.vault.id}-${subgraphNetworkToId(supportedSDKNetwork(position.vault.protocol.network))}`
          ]
        }
        sumrPrice={rewardTokenPrices.SUMR}
      />
    ))
  ) : (
    <div className={portfolioOverviewStyles.noPositionsWrapper}>
      <Text as="h5" variant="h5">
        You don’t have any positions yet
      </Text>
      <Text as="p" variant="p2">
        Start earning sustainably higher yields, optimized with AI.
        <br />
        Earn more, save time, and reduce costs.
      </Text>
      <Link href="/">
        <Button variant="primaryMedium">View strategies</Button>
      </Link>
    </div>
  )
}

export const PortfolioOverview = ({
  vaultsList,
  positions,
  rewardsData,
  isRewardsDataPending,
  vaultsApyByNetworkMap,
  rewardTokenPrices,
  viewWalletAddress,
}: PortfolioOverviewProps) => {
  const [positionsTab, setPositionsTab] = useState<string>('positions')

  const [showEmptyPositions, setShowEmptyPositions] = useLocalStorage<boolean>(
    'showEmptyPositions',
    false,
  )

  const filteredPositions = useMemo(() => {
    return showEmptyPositions
      ? positions
      : positions.filter((position) => {
          const positionValues = getPositionValues(position)

          return positionValues.netValueUSD.isGreaterThan(0)
        })
  }, [positions, showEmptyPositions])

  const sortedPositions = useMemo(() => {
    return [...filteredPositions].sort((a, b) => {
      const aValues = getPositionValues(a)
      const bValues = getPositionValues(b)

      return bValues.netValueUSD.comparedTo(aValues.netValueUSD) ?? 0
    })
  }, [filteredPositions])

  const hasPositions = !!sortedPositions.length
  const firstPosition = hasPositions ? sortedPositions[0] : undefined

  // The shared timeframe selector's availability is driven by the top position's history. That
  // position is above the fold, so we eagerly load its (deferred) chart data here; the matching
  // per-card query shares this query key and is served straight from cache.
  const { data: firstPositionHistory } = usePortfolioPositionHistoryQuery(
    viewWalletAddress,
    firstPosition
      ? supportedSDKNetwork(firstPosition.vault.protocol.network)
      : SupportedSDKNetworks.Base,
    firstPosition?.vault.id ?? '',
    hasPositions,
  )

  const { timeframe, setTimeframe } = useTimeframes({
    chartData: firstPositionHistory?.data,
    customDefaultTimeframe: hasPositions ? '90d' : undefined,
  })

  const handleSetNextTimeframe = (nextTimeframe: string) => {
    setTimeframe(nextTimeframe as TimeframesType)
  }

  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)

  const totalSummerPortfolioUSD = sortedPositions.reduce(
    (acc, position) => acc + getPositionValues(position).netValueUSD.toNumber(),

    0,
  )

  const overallSumr = calculateOverallSumr(rewardsData)

  const handleShowEmptyPositions = () => {
    setShowEmptyPositions((prev) => {
      return !prev
    })
  }

  const dataBlocks = useMemo(() => {
    return [
      {
        title: 'Total Summer.fi Portfolio',
        value: `$${formatFiatBalance(totalSummerPortfolioUSD)}`,
        gradient: 'var(--gradient-earn-protocol-light)',
        titleColor: 'var(--earn-protocol-secondary-60)',
      },
      {
        title: '$SUMR Token Rewards',
        value: isRewardsDataPending ? (
          <SkeletonLine height={40} width={150} style={{ marginTop: '6px' }} />
        ) : (
          `${formatCryptoBalance(overallSumr)} $SUMR`
        ),
      },
    ]
  }, [overallSumr, totalSummerPortfolioUSD, isRewardsDataPending])

  return (
    <div>
      <div className={portfolioOverviewStyles.portfolioPositionsListWrapper}>
        {dataBlocks.map((item) => (
          <Card
            key={item.title}
            style={{ flex: 1, background: item.gradient, minHeight: '142px' }}
            variant="cardSecondary"
          >
            <DataBlock
              title={item.title}
              titleStyle={{ color: item.titleColor }}
              value={item.value}
              valueSize="large"
            />
          </Card>
        ))}
        <Card className={portfolioOverviewStyles.portfolioPositionsList} variant="cardSecondary">
          <div className={portfolioOverviewStyles.portfolioPositionsListHeader}>
            <TabBarSimple
              tabs={[
                {
                  id: 'positions',
                  label: <Text variant="p2semi">Positions</Text>,
                },
              ]}
              tabBarStyle={{
                width: 'fit-content',
              }}
              activeTabId={positionsTab}
              onTabChange={(tab) => {
                setPositionsTab(tab.id)
              }}
            />
            {positionsTab === 'positions' ? (
              <div className={portfolioOverviewStyles.portfolioPositionsListOptions}>
                <ToggleButton
                  checked={showEmptyPositions}
                  title="Show empty positions"
                  onChange={handleShowEmptyPositions}
                />
                <Timeframes
                  timeframes={hasPositions ? allTimeframesAvailable : allTimeframesNotAvailable}
                  setActiveTimeframe={handleSetNextTimeframe}
                  activeTimeframe={timeframe}
                />
              </div>
            ) : (
              <div className={portfolioOverviewStyles.portfolioPositionsListOptions} />
            )}
          </div>
          {positionsTab === 'positions' ? (
            <PositionsListView
              sortedPositions={sortedPositions}
              walletAddress={viewWalletAddress}
              vaultsApyByNetworkMap={vaultsApyByNetworkMap}
              rewardTokenPrices={rewardTokenPrices}
              timeframe={timeframe}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          ) : null}

          <PortfolioVaultsCarousel
            vaultsList={vaultsList}
            vaultsApyByNetworkMap={vaultsApyByNetworkMap}
            style={{ marginTop: 'var(--general-space-24)' }}
            carouselId="portfolio-overview-you-might-like-carousel"
            rewardTokenPrices={rewardTokenPrices}
          />
        </Card>
        <NewsAndUpdates />
      </div>
    </div>
  )
}
