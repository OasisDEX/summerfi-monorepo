import { type FC } from 'react'
import {
  BigGradientBox,
  Button,
  Card,
  DataModule,
  Expander,
  Icon,
  SkeletonLine,
  TabBar,
  Table,
  type TableRow,
  Text,
  Tooltip,
  WithArrow,
} from '@summerfi/app-earn-ui'
import type { UserStakeV2 } from '@summerfi/armada-protocol-common'
import { BigNumber } from 'bignumber.js'
import Link from 'next/link'
import {
  Cell,
  type DefaultLegendContentProps,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts'

import {
  allLockedSumrPositionsTableColumns,
  yourLockedSumrPositionsTableColumns,
} from '@/components/molecules/LockedSumrInfoTabBarV2/constants'
import {
  type AllLockedSumrPositionsTableColumns,
  type LockedSumrPositionsTableColumns,
} from '@/components/molecules/LockedSumrInfoTabBarV2/types'
import { formatChartPercentageValue } from '@/features/forecast/chart-formatters'

import lockedSumrInfoTabBarV2Styles from './LockedSumrInfoTabBarV2.module.css'

const TableCenterCell = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ display: 'flex', justifyContent: 'center' }}>{children}</div>
}

const TableRightCell = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{children}</div>
}

const YourLockedSumrPositionsCards = () => {
  return (
    <div className={lockedSumrInfoTabBarV2Styles.lockedSumrPositionsCardsWrapper}>
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
              <Tooltip
                tooltipWrapperStyles={{
                  minWidth: '280px',
                }}
                tooltip="The maximum boost available for your SUMR rewards for staking SUMR, based on lock duration"
              >
                <Icon iconName="question_o" size={16} />
              </Tooltip>
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
            <Tooltip
              tooltip={<>Starts trading Jan.&nbsp;21.&nbsp;2026</>}
              tooltipWrapperStyles={{ minWidth: '140px' }}
            >
              <WithArrow style={{ cursor: 'not-allowed' }}>
                <Text variant="p3semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
                  Buy SUMR
                </Text>
              </WithArrow>
            </Tooltip>
          ),
        }}
        cardVariant="cardPrimary"
      />
    </div>
  )
}

const formatTimestamp = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp) * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const formatLockPeriod = (seconds: bigint): string => {
  const years = Number(seconds) / (365.25 * 24 * 60 * 60)

  return `${years.toFixed(1)} years`
}

interface YourLockedSumrPositionsTableProps {
  stakes: UserStakeV2[]
  isLoading: boolean
}

const YourLockedSumrPositionsTable: FC<YourLockedSumrPositionsTableProps> = ({
  stakes,
  isLoading,
}) => {
  const rowsData: TableRow<LockedSumrPositionsTableColumns>[] = stakes.map((stake) => ({
    id: stake.index.toString(),
    content: {
      position: `#${stake.index} - ${formatTimestamp(stake.lockupEndTime)}`,
      staked: <TableRightCell>{new BigNumber(stake.amount).div(1e18).toFormat(2)}</TableRightCell>,
      lockPeriod: <TableCenterCell>{formatLockPeriod(stake.lockupPeriod)}</TableCenterCell>,
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
          <Link href="Huh?">
            <WithArrow variant="p4semi" style={{ marginRight: '8px' }}>
              Remove stake
            </WithArrow>
          </Link>
        </TableCenterCell>
      ),
    },
  }))

  if (isLoading) {
    return (
      <div className={lockedSumrInfoTabBarV2Styles.tableResponsiveWrapper}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonLine key={idx} height={60} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={lockedSumrInfoTabBarV2Styles.tableResponsiveWrapper}>
      <Table<LockedSumrPositionsTableColumns>
        columns={yourLockedSumrPositionsTableColumns}
        rows={rowsData}
      />
    </div>
  )
}

const NoStakedPositions: FC = () => {
  return (
    <BigGradientBox className={lockedSumrInfoTabBarV2Styles.noStakedSumrGradient}>
      <div className={lockedSumrInfoTabBarV2Styles.noStakedSumrContentBox}>
        <Text variant="h4">You don’t have any staked SUMR positions yet.</Text>
        <div className={lockedSumrInfoTabBarV2Styles.noStakedSumrDataBoxes}>
          <div className={lockedSumrInfoTabBarV2Styles.noStakedSumrDataBox}>
            <Icon iconName="colorful_hamburger" size={48} />
            <Text variant="h5">
              Stake multiple positions and diversify your SUMR lockup period.
            </Text>
          </div>
          <div className={lockedSumrInfoTabBarV2Styles.noStakedSumrDataBox}>
            <Icon iconName="colorful_arrow" size={48} />
            <Text variant="h5">
              Boost your SUMR & USD APY up to 7x across positions with blended boost multiple
            </Text>
          </div>
        </div>
        <Button variant="primaryLarge">Stake your SUMR</Button>
      </div>
    </BigGradientBox>
  )
}

interface YourLockedSumrPositionsProps {
  stakes: UserStakeV2[]
  isLoading: boolean
}

const YourLockedSumrPositions: FC<YourLockedSumrPositionsProps> = ({ stakes, isLoading }) => {
  return (
    <Card variant="cardSecondary">
      <div className={lockedSumrInfoTabBarV2Styles.wrapper}>
        <YourLockedSumrPositionsCards />
        <YourLockedSumrPositionsTable stakes={stakes} isLoading={isLoading} />
      </div>
    </Card>
  )
}

const AllLockedSumrPositionsCards = () => {
  return (
    <div className={lockedSumrInfoTabBarV2Styles.lockedSumrPositionsCardsWrapper}>
      <DataModule
        // Huh?
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
          <RechartsTooltip
            formatter={(val) => `${formatChartPercentageValue(Number(val), true)}`}
            wrapperStyle={{
              zIndex: 1000,
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: '5px',
              padding: '10px',
              paddingTop: 0,
              marginTop: 0,
            }}
            labelStyle={{
              fontSize: '16px',
              fontWeight: '700',
              marginTop: '10px',
              marginBottom: '10px',
            }}
            itemStyle={{
              color: 'white !important',
            }}
            contentStyle={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '13px',
              lineHeight: '11px',
              letterSpacing: '-0.5px',
            }}
          />

          <Legend verticalAlign="top" align="right" layout="vertical" content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}

const AllLockedSumrPositionsTable = () => {
  return (
    <Table<AllLockedSumrPositionsTableColumns>
      columns={allLockedSumrPositionsTableColumns}
      rows={Array(6).fill({
        content: {
          staked: '89,323,322.3 SUMR',
          shareOfSumrStaked: <TableRightCell>12%</TableRightCell>,
          stakeTime: <TableRightCell>2 years</TableRightCell>,
          ownerAddress: <TableRightCell>0x5d...c94</TableRightCell>,
          usdValueEarningInLazySummer: (
            <TableRightCell>
              24.32m&nbsp;
              <Link href="Huh?">
                <WithArrow style={{ margin: '0 18px' }}>View</WithArrow>
              </Link>
            </TableRightCell>
          ),
        },
      })}
    />
  )
}

const AllLockedSumrPositionsData = () => {
  return (
    <div className={lockedSumrInfoTabBarV2Styles.wrapper}>
      <Expander title="Overview" defaultExpanded>
        <AllLockedSumrPositionsPieChart />
      </Expander>
      <Expander title="All staked positions">
        <AllLockedSumrPositionsTable />
      </Expander>
    </div>
  )
}

const AllLockedSumrPositions = () => {
  return (
    <div className={lockedSumrInfoTabBarV2Styles.wrapper}>
      <AllLockedSumrPositionsCards />
      <AllLockedSumrPositionsData />
    </div>
  )
}

interface LockedSumrInfoTabBarV2Props {
  stakes: UserStakeV2[]
  isLoading?: boolean
}

export const LockedSumrInfoTabBarV2: FC<LockedSumrInfoTabBarV2Props> = ({
  stakes,
  isLoading = false,
}) => {
  return (
    <div className={lockedSumrInfoTabBarV2Styles.wrapper}>
      <TabBar
        tabs={[
          {
            id: 'your-locked-sumr-positions',
            label: 'Your Locked SUMR Positions (stake)',
            content: <YourLockedSumrPositions stakes={stakes} isLoading={isLoading} />,
          },
          {
            id: 'your-locked-sumr-positions',
            label: 'Your Locked SUMR Positions (no stake)',
            content: <NoStakedPositions />,
          },
          {
            id: 'all-locked-sumr-positions',
            label: 'All Locked SUMR Positions',
            content: <AllLockedSumrPositions />,
          },
        ]}
      />
    </div>
  )
}
