import {
  Button,
  Card,
  DataModule,
  Expander,
  Icon,
  TabBar,
  Table,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'
import {
  Cell,
  type DefaultLegendContentProps,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts'

import { yourLockedSumrPositionsTableColumns } from '@/features/portfolio/components/PortfolioLockedSumrInfoV2/constants'
import { type LockedSumrPositionsTableColumns } from '@/features/portfolio/components/PortfolioLockedSumrInfoV2/types'

import portfolioLockedSumrInfoV2Styles from './PortfolioLockedSumrInfoV2.module.css'

const TableCenterCell = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ display: 'flex', justifyContent: 'center' }}>{children}</div>
}

const TableRightCell = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{children}</div>
}

const YourLockedSumrPositionsCards = () => {
  return (
    <div className={portfolioLockedSumrInfoV2Styles.lockedSumrPositionsCardsWrapper}>
      <DataModule
        dataBlock={{
          title: 'Total SUMR Staking positions',
          value: '4',
          valueSize: 'large',
          titleSize: 'medium',
          subValue: 'Next Unlock date: Sep. 22, 2027 (320,007.88 SUMR)',
          subValueStyle: { color: 'var(--earn-protocol-secondary-40)' },
        }}
        cardVariant="cardPrimary"
      />
      <DataModule
        dataBlock={{
          title: 'Blended APY boost multiple',
          value: '1.4x',
          valueSize: 'large',
          titleSize: 'medium',
          subValue: (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: 'var(--earn-protocol-secondary-40)',
              }}
            >
              <Icon iconName="question_o" size={16} />
              Max boost: 7x
            </div>
          ),
        }}
        cardVariant="cardPrimary"
      />
      <DataModule
        dataBlock={{
          title: 'Share of all staked SUMR',
          value: '0.79%',
          valueSize: 'large',
          titleSize: 'medium',
          subValue: (
            <WithArrow>
              <Link href="#">Buy SUMR</Link>
            </WithArrow>
          ),
        }}
        cardVariant="cardPrimary"
      />
    </div>
  )
}

const YourLockedSumrPositionsTable = () => {
  return (
    <Table<LockedSumrPositionsTableColumns>
      columns={yourLockedSumrPositionsTableColumns}
      rows={[
        {
          id: 'position-1',
          content: {
            position: '#1 - 2025-09-09 ',
            staked: <TableRightCell>58,558.03</TableRightCell>,
            lockPeriod: <TableCenterCell>0</TableCenterCell>,
            rewards: <TableCenterCell>0</TableCenterCell>,
            usdEarnings: <TableCenterCell>0</TableCenterCell>,
            removeStakePenalty: (
              <TableRightCell>
                <Text variant="p4semi" style={{ color: 'var(--color-text-critical)' }}>
                  n/a
                </Text>
              </TableRightCell>
            ),
            action: (
              <TableCenterCell>
                <Button
                  variant="primarySmall"
                  style={{
                    height: '28px',
                    fontSize: '11px',
                  }}
                >
                  Stake SUMR
                </Button>
              </TableCenterCell>
            ),
          },
        },
        {
          id: 'position-2',
          content: {
            position: '#2 - 2025-09-09 ',
            staked: <TableRightCell>117,116.06</TableRightCell>,
            lockPeriod: <TableCenterCell>2 years</TableCenterCell>,
            rewards: <TableCenterCell>35,343 SUMR (2x)</TableCenterCell>,
            usdEarnings: <TableCenterCell>$5,343 (2x)</TableCenterCell>,
            removeStakePenalty: (
              <TableRightCell>
                <Text variant="p4semi" style={{ color: 'var(--color-text-critical)' }}>
                  -32,323 (83.3%) SUMR
                </Text>
              </TableRightCell>
            ),
            action: (
              <TableCenterCell>
                <WithArrow variant="p4semi" style={{ marginRight: '8px' }}>
                  <Link href="#">Remove stake</Link>
                </WithArrow>
              </TableCenterCell>
            ),
          },
        },
        {
          id: 'position-3',
          content: {
            position: '#3 - 2025-09-09 ',
            staked: <TableRightCell>58,558.03</TableRightCell>,
            lockPeriod: <TableCenterCell>4 years</TableCenterCell>,
            rewards: <TableCenterCell>75,343 SUMR (4x)</TableCenterCell>,
            usdEarnings: <TableCenterCell>$3,343 (4x)</TableCenterCell>,
            removeStakePenalty: (
              <TableRightCell>
                <Text variant="p4semi" style={{ color: 'var(--color-text-critical)' }}>
                  -45,212 (93.6%) SUMR
                </Text>
              </TableRightCell>
            ),
            action: (
              <TableCenterCell>
                <WithArrow variant="p4semi" style={{ marginRight: '8px' }}>
                  <Link href="#">Remove stake</Link>
                </WithArrow>
              </TableCenterCell>
            ),
          },
        },
        {
          id: 'position-4',
          content: {
            position: '#4 - 2027-09-22 ',
            staked: <TableRightCell>320,007.88</TableRightCell>,
            lockPeriod: <TableCenterCell>1 years</TableCenterCell>,
            rewards: <TableCenterCell>25,343 SUMR (1.5x)</TableCenterCell>,
            usdEarnings: <TableCenterCell>$6,343 (1.5x)</TableCenterCell>,
            removeStakePenalty: (
              <TableRightCell>
                <Text variant="p4semi" style={{ color: 'var(--color-text-critical)' }}>
                  -145,223 (54.6%) SUMR
                </Text>
              </TableRightCell>
            ),
            action: (
              <TableCenterCell>
                <WithArrow variant="p4semi" style={{ marginRight: '8px' }}>
                  <Link href="#">Remove stake</Link>
                </WithArrow>
              </TableCenterCell>
            ),
          },
        },
      ]}
    />
  )
}

const YourLockedSumrPositions = () => {
  return (
    <div className={portfolioLockedSumrInfoV2Styles.wrapper}>
      <YourLockedSumrPositionsCards />
      <YourLockedSumrPositionsTable />
    </div>
  )
}

const AllLockedSumrPositionsCards = () => {
  return (
    <div className={portfolioLockedSumrInfoV2Styles.lockedSumrPositionsCardsWrapper}>
      <DataModule
        dataBlock={{
          title: 'Avg. SUMR Lock Period',
          value: '2 years',
          valueSize: 'large',
          titleSize: 'medium',
        }}
        cardVariant="cardPrimary"
      />
      <DataModule
        dataBlock={{
          title: 'Total SUMR Staked',
          value: '63.3m SUMR ',
          valueSize: 'large',
          titleSize: 'medium',
        }}
        cardVariant="cardPrimary"
      />
      <DataModule
        dataBlock={{
          title: '% of circulating SUMR supply Staked',
          value: '76.3%',
          valueSize: 'large',
          titleSize: 'medium',
        }}
        cardVariant="cardPrimary"
      />
    </div>
  )
}

const AllLockedSumrPositionsPieChart = () => {
  const data = [
    { name: 'Less than 2 weeks', value: 42 },
    { name: '2 weeks - 6 months', value: 21 },
    { name: '6 months - 1 year', value: 10 },
    { name: '1 year - 2 years', value: 3 },
    { name: 'More than 2 years', value: 3 },
  ]
  const COLORS = ['#ff80bf', '#fa52a6', '#ff4da6', '#ff1a8c', '#cc0066']

  const renderLegend = (props: DefaultLegendContentProps) => {
    const items = props.payload ?? []

    return (
      <div style={{ marginRight: '24px' }}>
        {items.map((entry, index) => {
          const itemName = String(entry.value ?? '')
          // prefer payload.value when provided; fall back to entry.value
          const rawValue = entry.payload?.value ?? entry.value
          const valueText = `${rawValue}%`

          return (
            <div
              key={`item-${index}`}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  marginBottom: 12,
                }}
              >
                <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
                  {itemName}
                </Text>
                <Text variant="p2semi">{valueText}</Text>
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                  userSelect: 'none',
                }}
              />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card style={{ padding: '32px 16px', minHeight: '440px', width: '60%' }}>
      <ResponsiveContainer width="100%" height={440}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={90}
            outerRadius={220}
            fill="#ff0000"
            stroke="none"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]}
                style={{
                  userSelect: 'none',
                  outline: 'none',
                }}
              />
            ))}
          </Pie>

          <Legend verticalAlign="top" align="right" layout="vertical" content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}

const AllLockedSumrPositionsData = () => {
  return (
    <div className={portfolioLockedSumrInfoV2Styles.wrapper}>
      <Expander title="Overview" defaultExpanded>
        <AllLockedSumrPositionsPieChart />
      </Expander>
      <Expander title="All staked positions">
        <Text variant="p2" style={{ marginBottom: '16px' }}>
          There are a total of 12,345 SUMR staking positions with a total of 63.3m SUMR staked. The
          average lock period is 2 years and the average boost multiple is 3.2x.
        </Text>
      </Expander>
    </div>
  )
}

const AllLockedSumrPositions = () => {
  return (
    <div className={portfolioLockedSumrInfoV2Styles.wrapper}>
      <AllLockedSumrPositionsCards />
      <AllLockedSumrPositionsData />
    </div>
  )
}

export const PortfolioLockedSumrInfoV2 = () => {
  return (
    <div className={portfolioLockedSumrInfoV2Styles.wrapper}>
      <Card variant="cardSecondary">
        <TabBar
          tabs={[
            {
              id: 'your-locked-sumr-positions',
              label: 'Your Locked SUMR Positions',
              content: <YourLockedSumrPositions />,
            },
            {
              id: 'all-locked-sumr-positions',
              label: 'All Locked SUMR Positions',
              content: <AllLockedSumrPositions />,
            },
          ]}
        />
      </Card>
    </div>
  )
}
