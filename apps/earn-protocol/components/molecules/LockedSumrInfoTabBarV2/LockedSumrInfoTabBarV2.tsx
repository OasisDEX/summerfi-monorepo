import { type FC, type ReactNode, useMemo } from 'react'
import {
  AllocationBar,
  BigGradientBox,
  Button,
  Card,
  DataModule,
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
import type {
  StakingEarningsEstimationForStakesV2,
  UserStakeV2,
} from '@summerfi/armada-protocol-common'
import { BigNumber } from 'bignumber.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'

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

const TableCenterCell = ({ children, title }: { title?: string; children: ReactNode }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} title={title}>
      {children}
    </div>
  )
}

const TableRightCell = ({ children, title }: { title?: string; children: ReactNode }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }} title={title}>
      {children}
    </div>
  )
}

const YourLockedSumrPositionsCards = ({
  stakes,
  isLoading,
  userBlendedYieldBoost,
  userSumrStaked,
  totalSumrStaked,
}: {
  stakes: UserStakeV2[]
  isLoading: boolean
  userBlendedYieldBoost: number
  userSumrStaked: number
  totalSumrStaked: number
}) => {
  const shareOfTotalStakedSumr = (
    userSumrStaked > 0 && totalSumrStaked > 0 ? (userSumrStaked / totalSumrStaked) * 100 : 0
  ).toFixed(2)
  const blendedYieldBoost = userBlendedYieldBoost.toFixed(2)

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
          value: `${blendedYieldBoost}x`,
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
              Max boost: 7.2655x
            </div>
          ),
        }}
        cardVariant="cardPrimary"
      />
      <DataModule
        dataBlock={{
          title: 'Share of all staked SUMR',
          value: `${shareOfTotalStakedSumr}%`,
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
  penaltyPercentages: { value: number; index: number }[]
  penaltyAmounts: { value: bigint; index: number }[]
  earningsEstimation: StakingEarningsEstimationForStakesV2 | null
}

const YourLockedSumrPositionsTable: FC<YourLockedSumrPositionsTableProps> = ({
  stakes,
  isLoading,
  userWalletAddress,
  refetchStakingData,
  penaltyPercentages,
  penaltyAmounts,
  earningsEstimation,
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
    .filter((stake) => stake.amount > 0n)
    .map((stake) => {
      // Find the corresponding penalty data by stake index
      const penaltyPercentage = penaltyPercentages.find((p) => p.index === stake.index)?.value ?? 0
      const penaltyAmount = penaltyAmounts.find((p) => p.index === stake.index)?.value ?? 0n

      // Find the corresponding earnings data by stake index (array index matches stake index)
      const stakeEarnings = earningsEstimation?.stakes[stake.index]
      const sumrRewards = stakeEarnings?.sumrRewardsAmount ?? 0n
      const usdEarnings = stakeEarnings?.usdEarningsAmount ?? '0'

      // Format penalty: "23,232 (12%) SUMR"
      const penaltyAmountFormatted = new BigNumber(penaltyAmount.toString()).shiftedBy(
        -SUMR_DECIMALS,
      )
      const penaltyPercentageFormatted = penaltyPercentage.toFixed(2)
      const penaltyDisplay = `${formatCryptoBalance(penaltyAmountFormatted)} (${penaltyPercentageFormatted}%) SUMR`

      // Format rewards: convert from wei
      const sumrRewardsFormatted = new BigNumber(sumrRewards.toString()).shiftedBy(-SUMR_DECIMALS)
      const rewardsDisplay = `${formatCryptoBalance(sumrRewardsFormatted)} (${stake.multiplier.toFixed(2)}x)`

      // Format USD earnings: simple dollar value
      const usdEarningsFormatted = new BigNumber(usdEarnings)
      const usdEarningsDisplay = `$${formatCryptoBalance(usdEarningsFormatted)} (${stake.multiplier.toFixed(2)}x)`

      return {
        id: stake.index.toString(),
        content: {
          position: (
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              #{stake.index}&nbsp;-&nbsp;{formatTimestamp(stake.lockupEndTime)}
            </span>
          ),
          staked: (
            <TableRightCell
              title={new BigNumber(stake.amount.toString()).shiftedBy(-SUMR_DECIMALS).toFixed(2)}
            >
              {formatCryptoBalance(
                new BigNumber(stake.amount.toString()).shiftedBy(-SUMR_DECIMALS),
              )}
            </TableRightCell>
          ),
          lockPeriod: <TableRightCell>{formatLockPeriod(stake.lockupPeriod)}</TableRightCell>,
          rewards: <TableCenterCell>{rewardsDisplay}</TableCenterCell>,
          usdEarnings: <TableCenterCell>{usdEarningsDisplay}</TableCenterCell>,
          removeStakePenalty: (
            <TableRightCell>
              <Text variant="p4semi" style={{ color: 'var(--color-text-critical)' }}>
                {penaltyDisplay}
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
                penaltyPercentage={penaltyPercentage}
                penaltyAmount={penaltyAmount}
              />
            </TableCenterCell>
          ),
        },
      }
    })

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
        <Link href="/staking/manage" prefetch>
          <Button variant="primaryLarge">Stake your SUMR</Button>
        </Link>
      </div>
    </BigGradientBox>
  )
}

interface YourLockedSumrPositionsProps {
  stakes: UserStakeV2[]
  isLoading: boolean
  userWalletAddress?: string
  refetchStakingData: () => Promise<void>
  penaltyPercentages: { value: number; index: number }[]
  penaltyAmounts: { value: bigint; index: number }[]
  earningsEstimation: StakingEarningsEstimationForStakesV2 | null
  userBlendedYieldBoost: number
  userSumrStaked: number
  totalSumrStaked: number
}

const YourLockedSumrPositions: FC<YourLockedSumrPositionsProps> = ({
  stakes,
  isLoading,
  userWalletAddress,
  refetchStakingData,
  penaltyPercentages,
  penaltyAmounts,
  earningsEstimation,
  userBlendedYieldBoost,
  userSumrStaked,
  totalSumrStaked,
}) => {
  return (
    <Card variant="cardSecondary">
      <div className={lockedSumrInfoTabBarV2Styles.wrapper}>
        <YourLockedSumrPositionsCards
          stakes={stakes}
          isLoading={isLoading}
          userBlendedYieldBoost={userBlendedYieldBoost}
          userSumrStaked={userSumrStaked}
          totalSumrStaked={totalSumrStaked}
        />
        <YourLockedSumrPositionsTable
          stakes={stakes}
          isLoading={isLoading}
          userWalletAddress={userWalletAddress}
          refetchStakingData={refetchStakingData}
          penaltyPercentages={penaltyPercentages}
          penaltyAmounts={penaltyAmounts}
          earningsEstimation={earningsEstimation}
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
  const COLORS = ['#ff80bf', '#fa52a6', '#fa3d9b', '#ff1a8c', '#cc0066']
  const allocation: {
    label: string
    percentage: number
    color: string
    tooltip?: ReactNode
  }[] = [
    {
      label: 'Less than 2 weeks',
      percentage: 0.42,
      color: COLORS[0],
    },
    {
      label: '2 weeks - 6 months',
      percentage: 0.2137,
      color: COLORS[1],
    },
    {
      label: '6 months - 1 year',
      percentage: 0.3063,
      color: COLORS[2],
    },
    {
      label: '1 year - 2 years',
      percentage: 0.03,
      color: COLORS[3],
    },
    {
      label: 'More than 2 years',
      percentage: 0.03,
      color: COLORS[4],
    },
  ]

  return (
    <div
      className={clsx(
        lockedSumrInfoTabBarV2Styles.wrapper,
        lockedSumrInfoTabBarV2Styles.allLockedSumrPositionsDataWrapper,
      )}
    >
      <Text variant="h5">SUMR Lock Period Allocation</Text>
      <AllocationBar items={allocation} variant="large" />
      <Text variant="h5">All Locked SUMR Positions</Text>
      <AllLockedSumrPositionsTable />
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
  penaltyPercentages: { value: number; index: number }[]
  penaltyAmounts: { value: bigint; index: number }[]
  earningsEstimation: StakingEarningsEstimationForStakesV2 | null
  userBlendedYieldBoost: number
  userSumrStaked: number
  totalSumrStaked: number
}

export const LockedSumrInfoTabBarV2: FC<LockedSumrInfoTabBarV2Props> = ({
  stakes,
  isLoading = false,
  userWalletAddress,
  refetchStakingData,
  penaltyPercentages,
  penaltyAmounts,
  earningsEstimation,
  userBlendedYieldBoost,
  userSumrStaked,
  totalSumrStaked,
}) => {
  return (
    <div className={lockedSumrInfoTabBarV2Styles.wrapper}>
      <TabBar
        tabs={[
          {
            id: 'your-locked-sumr-positions',
            label: 'Your Locked SUMR Positions',
            content: isLoading ? (
              <YourLockedSumrPositions
                stakes={stakes}
                isLoading
                userWalletAddress={userWalletAddress}
                refetchStakingData={refetchStakingData}
                penaltyPercentages={penaltyPercentages}
                penaltyAmounts={penaltyAmounts}
                earningsEstimation={earningsEstimation}
                userBlendedYieldBoost={userBlendedYieldBoost}
                userSumrStaked={userSumrStaked}
                totalSumrStaked={totalSumrStaked}
              />
            ) : stakes.length ? (
              <YourLockedSumrPositions
                stakes={stakes}
                isLoading={false}
                userWalletAddress={userWalletAddress}
                refetchStakingData={refetchStakingData}
                penaltyPercentages={penaltyPercentages}
                penaltyAmounts={penaltyAmounts}
                earningsEstimation={earningsEstimation}
                userBlendedYieldBoost={userBlendedYieldBoost}
                userSumrStaked={userSumrStaked}
                totalSumrStaked={totalSumrStaked}
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
