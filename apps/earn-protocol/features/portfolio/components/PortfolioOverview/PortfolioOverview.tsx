import { useCallback, useMemo } from 'react'
import {
  Button,
  Card,
  DataBlock,
  getDisplayToken,
  getPositionValues,
  getUniqueVaultId,
  PortfolioPosition,
  SUMR_CAP,
  Text,
  Timeframes,
  ToggleButton,
  useLocalConfig,
  useLocalStorage,
  useMobileCheck,
  WithArrow,
} from '@summerfi/app-earn-ui'
import {
  type GetVaultsApyResponse,
  type HistoryChartData,
  type SDKVaultsListType,
  type TimeframesType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatFiatBalance,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import Link from 'next/link'

import { type BlogPosts } from '@/app/server-handlers/blog-posts/types'
import { type MigratablePosition } from '@/app/server-handlers/migration'
import { PositionHistoricalChart } from '@/components/organisms/Charts/PositionHistoricalChart'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { NewsAndUpdates } from '@/features/news-and-updates/components/NewsAndUpdates/NewsAndUpdates'
import { PortfolioSummerPro } from '@/features/portfolio/components/PortfolioSummerPro/PortfolioSummerPro'
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
  positionsHistoricalChartMap: {
    [key: string]: HistoryChartData
  }
  vaultsApyByNetworkMap: GetVaultsApyResponse
  migratablePositions: MigratablePosition[]
  walletAddress: string
  migrationBestVaultApy: MigrationEarningsDataByChainId
  blogPosts: BlogPosts
}

export const PortfolioOverview = ({
  vaultsList,
  positions,
  rewardsData,
  positionsHistoricalChartMap,
  vaultsApyByNetworkMap,
  migratablePositions,
  walletAddress,
  migrationBestVaultApy,
  blogPosts,
}: PortfolioOverviewProps) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()

  const buttonClickEventHandler = useHandleButtonClickEvent()
  const tooltipEventHandler = useHandleTooltipOpenEvent()

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

      return bValues.netValueUSD.comparedTo(aValues.netValueUSD)
    })
  }, [filteredPositions])

  const hasPositions = !!sortedPositions.length

  const {
    timeframe,
    setTimeframe,
    timeframes: _timeframes, // ignored on portfolio, we allow all timeframes
  } = useTimeframes({
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

  const { features } = useSystemConfig()

  const migrationsEnabled = !!features?.Migrations
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const totalSummerPortfolioUSD = sortedPositions.reduce(
    (acc, position) => acc + getPositionValues(position).netValueUSD.toNumber(),

    0,
  )

  const overallSumr = calculateOverallSumr(rewardsData)

  const availableToMigrate = migratablePositions.reduce(
    (acc, position) => acc + Number(position.usdValue.amount),
    0,
  )

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
        value: `${formatCryptoBalance(overallSumr)} $SUMR`,
      },
      ...(migrationsEnabled
        ? [
            {
              title: 'Available to Migrate',
              value: `$${formatFiatBalance(availableToMigrate)}`,
              subValue: (
                <Link
                  href={`/migrate/user/${walletAddress}`}
                  onClick={handleButtonClick('migrate')}
                >
                  <WithArrow
                    as="p"
                    variant="p3semi"
                    style={{ color: 'var(--earn-protocol-primary-100)' }}
                  >
                    Migrate
                  </WithArrow>
                </Link>
              ),
            },
          ]
        : [
            {
              title: 'Available to Migrate',
              value: `Coming Soon`,
            },
          ]),
    ]
  }, [
    availableToMigrate,
    handleButtonClick,
    migrationsEnabled,
    overallSumr,
    totalSummerPortfolioUSD,
    walletAddress,
  ])

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
              subValue={item.subValue}
            />
          </Card>
        ))}
        <Card className={portfolioOverviewStyles.portfolioPositionsList} variant="cardSecondary">
          <div className={portfolioOverviewStyles.portfolioPositionsListHeader}>
            <Text as="h5" variant="h5">
              Positions
            </Text>
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
          </div>
          {hasPositions ? (
            sortedPositions.map((position) => (
              <PortfolioPosition
                isMobile={isMobile || isTablet}
                key={`Position_${position.position.id.id}_${position.vault.protocol.network}`}
                portfolioPosition={position}
                buttonClickEventHandler={buttonClickEventHandler}
                tooltipEventHandler={tooltipEventHandler}
                positionGraph={
                  <PositionHistoricalChart
                    chartData={positionsHistoricalChartMap[getUniqueVaultId(position.vault)]}
                    position={position}
                    timeframe={timeframe}
                    tokenSymbol={
                      getDisplayToken(position.vault.inputToken.symbol) as TokenSymbolsList
                    }
                  />
                }
                vaultApyData={
                  vaultsApyByNetworkMap[
                    `${position.vault.id}-${subgraphNetworkToId(supportedSDKNetwork(position.vault.protocol.network))}`
                  ]
                }
                sumrPrice={estimatedSumrPrice}
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
              <Link href="/" onClick={handleButtonClick('portfolio-overview-view-strategies')}>
                <Button variant="primaryMedium">View strategies</Button>
              </Link>
            </div>
          )}
          <PortfolioVaultsCarousel
            vaultsList={vaultsList}
            vaultsApyByNetworkMap={vaultsApyByNetworkMap}
            style={{ marginTop: 'var(--general-space-24)' }}
            carouselId="portfolio-overview-you-might-like-carousel"
          />
        </Card>
        {migrationsEnabled && (
          <PortfolioSummerPro
            walletAddress={walletAddress}
            migratablePositions={migratablePositions}
            migrationBestVaultApy={migrationBestVaultApy}
            carouselId="portfolio-overview-migrate-carousel"
          />
        )}
        <NewsAndUpdates blogPosts={blogPosts} />
      </div>
    </div>
  )
}
