import {
  Card,
  DataBlock,
  Icon,
  SlideCarousel,
  StrategyCard,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { MockedLineChart } from '@/components/organisms/Charts/MockedLineChart'
import { strategiesList } from '@/constants/dev-strategies-list'
import { NewsAndUpdates } from '@/features/news-and-updates/components/NewsAndUpdates/NewsAndUpdates'
import { CryptoUtilities } from '@/features/crypto-utilities/components/CryptoUtilities/CryptoUtilities'

const dummyNewsAndUpdatesItems = [
  {
    title: 'SUMR Market Cap hits 10b',
    timestamp: 1729236816761,
    link: './',
  },
  {
    title: 'SUMR Market Cap hits 10b',
    timestamp: 1729236816762,
    link: './',
  },
  {
    title: 'SUMR Market Cap hits 10b',
    timestamp: 1729236816763,
    link: './',
  },
  {
    title: 'SUMR Market Cap hits 10b',
    timestamp: 1729236816764,
    link: './',
  },
]

const dataBlocks = [
  {
    title: 'Total Summer.fi Portfolio',
    value: '$100,233.32',
    gradient: 'var(--gradient-earn-protocol-light)',
    titleColor: 'var(--earn-protocol-secondary-60)',
  },
  {
    title: 'SUMR Token Rewards',
    value: '45,232 $SUMR',
  },
  {
    title: 'Available to Migrate',
    value: '$1002,322,32',
    subValue: (
      <Link href="/apps/earn-protocol/public">
        <WithArrow as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
          Migrate
        </WithArrow>
      </Link>
    ),
  },
]

export const PortfolioOverview = () => {
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
        {dataBlocks.map((item) => (
          <Card key={item.title} style={{ flex: 1, background: item.gradient, minHeight: '142px' }}>
            <DataBlock
              title={item.title}
              titleStyle={{ color: item.titleColor }}
              value={item.value}
              valueSize="large"
              subValue={item.subValue}
            />
          </Card>
        ))}
        <Card style={{ flexDirection: 'column' }}>
          <Text as="h5" variant="h5">
            Positions
          </Text>
          <MockedLineChart />
          <div style={{ width: '100%', marginTop: 'var(--general-space-24)' }}>
            <SlideCarousel
              slides={strategiesList.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  {...strategy}
                  secondary
                  withHover
                  // eslint-disable-next-line no-console
                  onClick={(item) => console.log('strategy clicked', item)}
                />
              ))}
              options={{ slidesToScroll: 'auto' }}
              title={
                <div
                  style={{ display: 'flex', gap: 'var(--general-space-8)', alignItems: 'center' }}
                >
                  <Icon iconName="stars" variant="s" color="rgba(255, 251, 253, 1)" />
                  <Text as="p" variant="p3semi">
                    You might like
                  </Text>
                </div>
              }
            />
          </div>
        </Card>
        <NewsAndUpdates items={dummyNewsAndUpdatesItems} />
        <CryptoUtilities />
      </div>
    </div>
  )
}
