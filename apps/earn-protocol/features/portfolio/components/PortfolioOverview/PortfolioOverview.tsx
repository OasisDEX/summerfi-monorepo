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
  useLocalConfig,
} from '@summerfi/app-earn-ui'
import {
  type HistoryChartData,
  type SDKVaultsListType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance, subgraphNetworkToId } from '@summerfi/app-utils'
import Link from 'next/link'

import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { PositionHistoricalChart } from '@/components/organisms/Charts/PositionHistoricalChart'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { PortfolioVaultsCarousel } from '@/features/portfolio/components/PortfolioVaultsCarousel/PortfolioVaultsCarousel'
import { type PositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { calculateOverallSumr } from '@/helpers/calculate-overall-sumr'

import portfolioOverviewStyles from './PortfolioOverview.module.scss'

// const dummyNewsAndUpdatesItems = [
//   {
//     title: 'SUMR Market Cap hits 10b',
//     timestamp: 1729236816761,
//     link: './',
//   },
//   {
//     title: 'SUMR Market Cap hits 10b',
//     timestamp: 1729236816762,
//     link: './',
//   },
//   {
//     title: 'SUMR Market Cap hits 10b',
//     timestamp: 1729236816763,
//     link: './',
//   },
//   {
//     title: 'SUMR Market Cap hits 10b',
//     timestamp: 1729236816764,
//     link: './',
//   },
// ]

const getDatablocks = ({
  totalSummerPortfolioUSD,
  overallSumr,
}: {
  totalSummerPortfolioUSD: number
  overallSumr: number
}) => [
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
  {
    title: 'Available to Migrate',
    value: 'Coming Soon',
    // subValue: (
    //   <Link href="/apps/earn-protocol/public">
    //     <WithArrow as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
    //       Migrate
    //     </WithArrow>
    //   </Link>
    // ),
  },
]

type PortfolioOverviewProps = {
  vaultsList: SDKVaultsListType
  positions: PositionWithVault[]
  rewardsData: ClaimDelegateExternalData
  positionsHistoricalChartMap: {
    [key: string]: HistoryChartData
  }
  vaultsApyByNetworkMap: GetVaultsApyResponse
}

export const PortfolioOverview = ({
  vaultsList,
  positions,
  rewardsData,
  positionsHistoricalChartMap,
  vaultsApyByNetworkMap,
}: PortfolioOverviewProps) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const totalSummerPortfolioUSD = positions.reduce(
    (acc, position) => acc + getPositionValues(position).netValueUSD.toNumber(),

    0,
  )

  const overallSumr = calculateOverallSumr(rewardsData)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 'var(--general-space-16)',
          flexWrap: 'wrap',
        }}
      >
        {getDatablocks({ totalSummerPortfolioUSD, overallSumr }).map((item) => (
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
              // subValue={item.subValue}
            />
          </Card>
        ))}
        <Card style={{ flexDirection: 'column' }} variant="cardSecondary">
          <Text as="h5" variant="h5">
            Positions
          </Text>
          {positions.length > 0 ? (
            positions.map((position) => (
              <PortfolioPosition
                key={`Position_${position.position.id.id}_${position.vault.protocol.network}`}
                portfolioPosition={position}
                positionGraph={
                  <PositionHistoricalChart
                    chartData={positionsHistoricalChartMap[getUniqueVaultId(position.vault)]}
                    position={position}
                    tokenSymbol={
                      getDisplayToken(position.vault.inputToken.symbol) as TokenSymbolsList
                    }
                  />
                }
                apy={
                  vaultsApyByNetworkMap[
                    `${position.vault.id}-${subgraphNetworkToId(position.vault.protocol.network)}`
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
              <Link href="/">
                <Button variant="primaryMedium">View strategies</Button>
              </Link>
            </div>
          )}
          <PortfolioVaultsCarousel
            vaultsList={vaultsList}
            vaultsApyByNetworkMap={vaultsApyByNetworkMap}
            style={{ marginTop: 'var(--general-space-24)' }}
          />
        </Card>
        {/* <NewsAndUpdates items={dummyNewsAndUpdatesItems} /> */}
        {/* <CryptoUtilities /> */}
      </div>
    </div>
  )
}
