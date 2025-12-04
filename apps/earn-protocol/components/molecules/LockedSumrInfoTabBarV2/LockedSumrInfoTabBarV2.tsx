import { type FC, useMemo } from 'react'
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
import { formatCryptoBalance } from '@summerfi/app-utils'
import type { UserStakeV2 } from '@summerfi/armada-protocol-common'
import { BigNumber } from 'bignumber.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
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
import { RemoveStakeModalButton } from '@/components/molecules/LockedSumrInfoTabBarV2/RemoveStakeModalButton'
import {
  type AllLockedSumrPositionsTableColumns,
  type LockedSumrPositionsTableColumns,
} from '@/components/molecules/LockedSumrInfoTabBarV2/types'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { formatChartPercentageValue } from '@/features/forecast/chart-formatters'

import lockedSumrInfoTabBarV2Styles from './LockedSumrInfoTabBarV2.module.css'

dayjs.extend(relativeTime)

const formatTimestamp = (timestamp: bigint): string => {
  const date = dayjs.unix(Number(timestamp))

  return date.format('YYYY-MM-DD')
}

const formatLockPeriod = (seconds: bigint): string => {
  // returns a nice formatted lock period like "2 years", "6 months", "3 weeks", "5 days"
  const dayjsNow = dayjs()
  const timestamp = dayjsNow.add(Number(seconds), 'seconds')
  const daysCount = timestamp.diff(dayjsNow, 'days')
  const hoursCount = timestamp.diff(dayjsNow, 'hours')
  const minutesCount = timestamp.diff(dayjsNow, 'minutes')
  const minutesClamped = minutesCount % 60

  const hoursLabel = hoursCount === 1 ? 'hour' : `hours`
  const minutesLabel = minutesClamped === 1 ? 'minute' : `minutes`

  if (Number(seconds) === 0) {
    return `No lockup`
  }

  if (daysCount === 0) {
    // if its zero days its gonna show hours and minutes

    return `${hoursCount > 0 ? `${hoursCount} ${hoursLabel}, ` : ''}${minutesClamped > 0 ? `${minutesClamped} ${minutesLabel}` : ''}`
  }

  if (daysCount <= 2) {
    // if its less than two days its gonna show hours
    return `${hoursCount} ${hoursLabel}`
  }

  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(Number(daysCount))} days`
}

const TableCenterCell = ({ children, title }: { title?: string; children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} title={title}>
      {children}
    </div>
  )
}

const TableRightCell = ({ children, title }: { title?: string; children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }} title={title}>
      {children}
    </div>
  )
}

const YourLockedSumrPositionsCards = ({
  stakes,
  isLoading,
}: {
  stakes: UserStakeV2[]
  isLoading: boolean
}) => {
  const nextUnlockStake = useMemo(() => {
    const sortedStakes = stakes
      .filter((stake) => stake.amount > 0n && stake.lockupPeriod > 0n)
      .sort((a, b) => {
        return Number(a.lockupEndTime - b.lockupEndTime)
      })

    if (sortedStakes.length === 0) {
      return 'n/a'
    }
    const nextUnlockAmount = new BigNumber(sortedStakes[0].amount).div(
      new BigNumber(10).pow(SUMR_DECIMALS),
    )
    const [nextStake] = sortedStakes

    return `${formatCryptoBalance(nextUnlockAmount)} SUMR @ ${dayjs().add(Number(nextStake.lockupPeriod), 'seconds').format('MMM D, YYYY')}`
  }, [stakes])

  return (
    <div className={lockedSumrInfoTabBarV2Styles.lockedSumrPositionsCardsWrapper}>
      <DataModule
        dataBlock={{
          title: 'Total SUMR Staking positions',
          value: isLoading ? (
            <SkeletonLine height="30px" width="40px" style={{ margin: '5px 0' }} />
          ) : (
            stakes.length.toString()
          ),
          valueSize: 'large',
          titleSize: 'medium',
          subValue: isLoading ? (
            <SkeletonLine height="14px" width="150px" style={{ margin: '3px 0' }} />
          ) : (
            `Next Unlock: ${nextUnlockStake}`
          ),
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

interface YourLockedSumrPositionsTableProps {
  stakes: UserStakeV2[]
  isLoading: boolean
  userWalletAddress?: string
  refetchStakingData: () => Promise<void>
}

const YourLockedSumrPositionsTable: FC<YourLockedSumrPositionsTableProps> = ({
  stakes,
  isLoading,
  userWalletAddress,
  refetchStakingData,
}) => {
  if (isLoading) {
    return (
      <div className={lockedSumrInfoTabBarV2Styles.tableResponsiveWrapper}>
        <Table<LockedSumrPositionsTableColumns>
          columns={yourLockedSumrPositionsTableColumns}
          rows={Array(4).fill({
            content: {
              position: <SkeletonLine height="20px" width="80px" />,
              staked: <SkeletonLine height="20px" width="60px" style={{ marginLeft: 'auto' }} />,
              lockPeriod: (
                <SkeletonLine height="20px" width="50px" style={{ marginLeft: 'auto' }} />
              ),
              rewards: <SkeletonLine height="20px" width="40px" style={{ margin: '0 auto' }} />,
              usdEarnings: <SkeletonLine height="20px" width="40px" style={{ margin: '0 auto' }} />,
              removeStakePenalty: (
                <SkeletonLine height="20px" width="40px" style={{ marginLeft: 'auto' }} />
              ),
              action: <SkeletonLine height="20px" width="80px" style={{ margin: '0 auto' }} />,
            },
          })}
        />
      </div>
    )
  }

  const rowsData: TableRow<LockedSumrPositionsTableColumns>[] = stakes
    .filter((stake) => Number(stake.amount))
    .map((stake) => ({
      id: stake.index.toString(),
      content: {
        position: (
          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
            #{stake.index}&nbsp;-&nbsp;{formatTimestamp(stake.lockupEndTime)}
          </span>
        ),
        staked: (
          <TableRightCell
            title={new BigNumber(stake.amount).div(new BigNumber(10).pow(SUMR_DECIMALS)).toFixed(2)}
          >
            {formatCryptoBalance(
              new BigNumber(stake.amount).div(new BigNumber(10).pow(SUMR_DECIMALS)),
            )}
          </TableRightCell>
        ),
        lockPeriod: <TableRightCell>{formatLockPeriod(stake.lockupPeriod)}</TableRightCell>,
        rewards: <TableCenterCell>n/a</TableCenterCell>,
        usdEarnings: <TableCenterCell>n/a</TableCenterCell>,
        removeStakePenalty: (
          <TableRightCell>
            <Text variant="p4semi" style={{ color: 'var(--color-text-critical)' }}>
              n/a
            </Text>
          </TableRightCell>
        ),
        action: (
          <TableCenterCell>
            <RemoveStakeModalButton
              userWalletAddress={userWalletAddress}
              amount={stake.amount}
              userStakeIndex={BigInt(stake.index)}
              refetchStakingData={refetchStakingData}
            />
          </TableCenterCell>
        ),
      },
    }))

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
  userWalletAddress?: string
  refetchStakingData: () => Promise<void>
}

const YourLockedSumrPositions: FC<YourLockedSumrPositionsProps> = ({
  stakes,
  isLoading,
  userWalletAddress,
  refetchStakingData,
}) => {
  return (
    <Card variant="cardSecondary">
      <div className={lockedSumrInfoTabBarV2Styles.wrapper}>
        <YourLockedSumrPositionsCards stakes={stakes} isLoading={isLoading} />
        <YourLockedSumrPositionsTable
          stakes={stakes}
          isLoading={isLoading}
          userWalletAddress={userWalletAddress}
          refetchStakingData={refetchStakingData}
        />
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
  userWalletAddress?: string
  refetchStakingData: () => Promise<void>
}

export const LockedSumrInfoTabBarV2: FC<LockedSumrInfoTabBarV2Props> = ({
  stakes,
  isLoading = false,
  userWalletAddress,
  refetchStakingData,
}) => {
  return (
    <div className={lockedSumrInfoTabBarV2Styles.wrapper}>
      <TabBar
        tabs={[
          {
            id: 'your-locked-sumr-positions',
            label: 'Your Locked SUMR Positions',
            content: stakes.length ? (
              <YourLockedSumrPositions
                stakes={stakes}
                isLoading={isLoading}
                userWalletAddress={userWalletAddress}
                refetchStakingData={refetchStakingData}
              />
            ) : (
              <NoStakedPositions />
            ),
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
