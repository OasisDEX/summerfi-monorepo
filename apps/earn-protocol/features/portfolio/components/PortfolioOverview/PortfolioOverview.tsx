import { useCallback, useMemo, useState } from 'react'
import {
  Button,
  Card,
  DataBlock,
  getDisplayToken,
  getPositionValues,
  getUniqueVaultId,
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
  type SingleSourceChartData,
  type TimeframesType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatFiatBalance,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { ArmadaDcaOrderStatusEnum, type IArmadaDcaOrder } from '@summerfi/sdk-common'
import Link from 'next/link'

// import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { PositionHistoricalChart } from '@/components/organisms/Charts/PositionHistoricalChart'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
// import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
// import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { NewsAndUpdates } from '@/features/news-and-updates/components/NewsAndUpdates/NewsAndUpdates'
import { PortfolioDcaPosition } from '@/features/portfolio/components/PortfolioOverview/PortfolioDcaPosition'
// import { PortfolioSummerPro } from '@/features/portfolio/components/PortfolioSummerPro/PortfolioSummerPro'
import { PortfolioVaultsCarousel } from '@/features/portfolio/components/PortfolioVaultsCarousel/PortfolioVaultsCarousel'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { calculateOverallSumr } from '@/helpers/calculate-overall-sumr'
import { useHandleButtonClickEvent, useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'
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
  positionsHistoricalChartMap: {
    [key: string]: SingleSourceChartData
  }
  vaultsApyByNetworkMap: GetVaultsApyResponse
  rewardTokenPrices: RewardTokenPrices
  dcaOrders: IArmadaDcaOrder[]
  dcaEnabled?: boolean
}

const PositionsListView = ({
  sortedPositions,
  positionsHistoricalChartMap,
  vaultsApyByNetworkMap,
  rewardTokenPrices,
  timeframe,
  buttonClickEventHandler,
  tooltipEventHandler,
  isMobile,
  isTablet,
  handleButtonClick,
  dcaOrders,
}: {
  sortedPositions: PositionWithVault[]
  positionsHistoricalChartMap: {
    [key: string]: SingleSourceChartData
  }
  vaultsApyByNetworkMap: GetVaultsApyResponse
  rewardTokenPrices: RewardTokenPrices
  timeframe: TimeframesType
  buttonClickEventHandler: ReturnType<typeof useHandleButtonClickEvent>
  tooltipEventHandler: ReturnType<typeof useHandleTooltipOpenEvent>
  isMobile: boolean
  isTablet: boolean
  handleButtonClick: (event: string) => void
  dcaOrders: IArmadaDcaOrder[]
}) => {
  const getDcaOrderForVault = (
    vaultId: string,
  ): { id: string; type: 'from' | 'to' } | undefined => {
    const normalizedId = vaultId.toLowerCase()

    const order = dcaOrders.find(
      (o) => o.fromVault.toLowerCase() === normalizedId || o.toVault.toLowerCase() === normalizedId,
    )

    if (!order) return undefined

    const type =
      order.fromVault.toLowerCase() === normalizedId ? ('from' as const) : ('to' as const)

    return { id: order.id, type }
  }

  return sortedPositions.length ? (
    sortedPositions.map((position) => (
      <PortfolioPosition
        isMobile={isMobile || isTablet}
        key={`Position_${position.position.id.id}_${position.vault.protocol.network}`}
        portfolioPosition={position}
        buttonClickEventHandler={buttonClickEventHandler}
        tooltipEventHandler={tooltipEventHandler}
        dcaOrderId={getDcaOrderForVault(position.vault.id)?.id}
        dcaOrderType={getDcaOrderForVault(position.vault.id)?.type}
        positionGraph={
          <PositionHistoricalChart
            chartData={positionsHistoricalChartMap[getUniqueVaultId(position.vault)]}
            position={position}
            timeframe={timeframe}
            tokenSymbol={getDisplayToken(position.vault.inputToken.symbol) as TokenSymbolsList}
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
      <Link
        href="/"
        onClick={() => {
          handleButtonClick('portfolio-overview-view-strategies')
        }}
      >
        <Button variant="primaryMedium">View strategies</Button>
      </Link>
    </div>
  )
}

const DcaStrategiesListView = ({
  dcaOrders,
  vaultsList,
  buttonClickEventHandler,
}: {
  dcaOrders: IArmadaDcaOrder[]
  vaultsList: SDKVaultsListType
  buttonClickEventHandler: ReturnType<typeof useHandleButtonClickEvent>
}) => {
  return (
    <div className={portfolioOverviewStyles.portfolioDcaPositionsListWrapper}>
      {dcaOrders.length ? (
        dcaOrders.map((order) => (
          <PortfolioDcaPosition key={order.id} order={order} vaultsList={vaultsList} />
        ))
      ) : (
        <div className={portfolioOverviewStyles.noPositionsWrapper}>
          <Text as="h5" variant="h5">
            You don’t have any DCA strategies yet
          </Text>
          <Link
            href="/dca/new"
            onClick={() => {
              buttonClickEventHandler('portfolio-overview-view-strategies')
            }}
          >
            <Button variant="primaryMedium">View DCA strategies</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export const PortfolioOverview = ({
  vaultsList,
  positions,
  rewardsData,
  isRewardsDataPending,
  positionsHistoricalChartMap,
  vaultsApyByNetworkMap,
  rewardTokenPrices,
  dcaOrders,
  dcaEnabled,
}: PortfolioOverviewProps) => {
  const [positionsTab, setPositionsTab] = useState<string>('positions')
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const tooltipEventHandler = useHandleTooltipOpenEvent()

  const [showEmptyPositions, setShowEmptyPositions] = useLocalStorage<boolean>(
    'showEmptyPositions',
    false,
  )
  const [showInactiveDcaPositions, setShowInactiveDcaPositions] = useLocalStorage<boolean>(
    'showInactiveDcaPositions',
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

  const filteredDcaOrders = useMemo(() => {
    return showInactiveDcaPositions
      ? dcaOrders
      : dcaOrders.filter((order) => order.status === ArmadaDcaOrderStatusEnum.Active)
  }, [dcaOrders, showInactiveDcaPositions])

  const hasPositions = !!sortedPositions.length

  const { timeframe, setTimeframe } = useTimeframes({
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    chartData: hasPositions
      ? positionsHistoricalChartMap[getUniqueVaultId(sortedPositions[0].vault)].data
      : undefined,
  })

  const handleSetNextTimeframe = (nextTimeframe: string) => {
    setTimeframe(nextTimeframe as TimeframesType)
    buttonClickEventHandler(`portfolio-overview-positions-timeframe-set-${nextTimeframe}`)
  }

  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)

  const totalSummerPortfolioUSD = sortedPositions.reduce(
    (acc, position) => acc + getPositionValues(position).netValueUSD.toNumber(),

    0,
  )

  const overallSumr = calculateOverallSumr(rewardsData)

  const handleButtonClick = useCallback(
    (buttonName: string) => () => {
      buttonClickEventHandler(`portfolio-overview-${buttonName}`)
    },
    [buttonClickEventHandler],
  )

  const handleShowEmptyPositions = () => {
    setShowEmptyPositions((prev) => {
      buttonClickEventHandler(`portfolio-overview-portfolio-overview-show-empty-positions-${!prev}`)

      return !prev
    })
  }

  const handleShowInactiveDcaPositions = () => {
    setShowInactiveDcaPositions((prev) => {
      buttonClickEventHandler(`portfolio-overview-show-inactive-dca-positions-${!prev}`)

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
              tabs={
                dcaEnabled
                  ? [
                      {
                        id: 'positions',
                        label: <Text variant="p2semi">Positions</Text>,
                      },
                      {
                        id: 'dca-strategies',
                        label: <Text variant="p2semi">DCA&nbsp;Strategies</Text>,
                      },
                    ]
                  : [
                      {
                        id: 'positions',
                        label: <Text variant="p2semi">Positions</Text>,
                      },
                    ]
              }
              tabBarStyle={{
                width: 'fit-content',
              }}
              activeTabId={positionsTab}
              onTabChange={(tab) => {
                setPositionsTab(tab.id)
                buttonClickEventHandler(`portfolio-overview-tab-changed-${tab.id}`)
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
            ) : positionsTab === 'dca-strategies' ? (
              <div className={portfolioOverviewStyles.portfolioPositionsListOptions}>
                <ToggleButton
                  checked={showInactiveDcaPositions}
                  title="Show inactive DCA positions"
                  onChange={handleShowInactiveDcaPositions}
                />
              </div>
            ) : (
              <div className={portfolioOverviewStyles.portfolioPositionsListOptions} />
            )}
          </div>
          {positionsTab === 'positions' ? (
            <PositionsListView
              sortedPositions={sortedPositions}
              positionsHistoricalChartMap={positionsHistoricalChartMap}
              vaultsApyByNetworkMap={vaultsApyByNetworkMap}
              rewardTokenPrices={rewardTokenPrices}
              timeframe={timeframe}
              buttonClickEventHandler={buttonClickEventHandler}
              tooltipEventHandler={tooltipEventHandler}
              isMobile={isMobile}
              isTablet={isTablet}
              handleButtonClick={handleButtonClick}
              dcaOrders={dcaOrders}
            />
          ) : null}
          {positionsTab === 'dca-strategies' ? (
            <DcaStrategiesListView
              dcaOrders={filteredDcaOrders}
              vaultsList={vaultsList}
              buttonClickEventHandler={buttonClickEventHandler}
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
        {/* {migrationsEnabled && (
          <PortfolioSummerPro
            viewWalletAddress={viewWalletAddress}
            migratablePositions={migratablePositions}
            migrationBestVaultApy={migrationBestVaultApy}
            carouselId="portfolio-overview-migrate-carousel"
          />
        )} */}
        <NewsAndUpdates />
      </div>
    </div>
  )
}
