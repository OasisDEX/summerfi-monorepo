import { Card, DataBlock, getPositionValues, PortfolioPosition, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { type PortfolioPositionsList } from '@/app/server-handlers/portfolio/portfolio-positions-handler'
import { PositionHistoricalChart } from '@/components/organisms/Charts/PositionHistoricalChart'
import { SUMR_CAP } from '@/constants/earn-protocol'
import { useLocalConfig } from '@/contexts/LocalConfigContext/LocalConfigContext'
import { PortfolioVaultsCarousel } from '@/features/portfolio/components/PortfolioVaultsCarousel/PortfolioVaultsCarousel'

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
  sumrTokenRewards,
}: {
  totalSummerPortfolioUSD: number
  sumrTokenRewards: number
}) => [
  {
    title: 'Total Summer.fi Portfolio',
    value: `$${formatFiatBalance(totalSummerPortfolioUSD)}`,
    gradient: 'var(--gradient-earn-protocol-light)',
    titleColor: 'var(--earn-protocol-secondary-60)',
  },
  {
    title: 'SUMR Token Rewards',
    value: `${formatCryptoBalance(sumrTokenRewards)} $SUMR`,
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
  positions: PortfolioPositionsList[]
}

export const PortfolioOverview = ({ vaultsList, positions }: PortfolioOverviewProps) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const totalSummerPortfolioUSD = positions.reduce(
    (acc, position) =>
      acc +
      getPositionValues({
        positionData: position.positionData,
        vaultData: position.vaultData,
      }).netEarningsUSD.toNumber(),

    0,
  )
  // TODO: get sumrTokenRewards
  const sumrTokenRewards = 0

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
        {getDatablocks({ totalSummerPortfolioUSD, sumrTokenRewards }).map((item) => (
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
                key={`Position_${position.positionData.id.id}`}
                position={position}
                positionGraph={
                  <PositionHistoricalChart
                    chartData={position.vaultData.customFields?.historyChartData}
                    position={position}
                    tokenSymbol={position.vaultData.inputToken.symbol as TokenSymbolsList}
                  />
                }
                sumrPrice={estimatedSumrPrice}
              />
            ))
          ) : (
            <Text as="p" variant="p1semi">
              No positions
            </Text>
          )}
          <PortfolioVaultsCarousel
            vaultsList={vaultsList}
            style={{ marginTop: 'var(--general-space-24)' }}
          />
        </Card>
        {/* <NewsAndUpdates items={dummyNewsAndUpdatesItems} /> */}
        {/* <CryptoUtilities /> */}
      </div>
    </div>
  )
}
