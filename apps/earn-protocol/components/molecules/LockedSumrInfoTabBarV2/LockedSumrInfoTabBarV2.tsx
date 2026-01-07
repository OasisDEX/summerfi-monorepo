import { type FC, type ReactNode, useMemo, useState } from 'react'
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
  type TableSortedColumn,
  Text,
  Tooltip,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent, SortDirection } from '@summerfi/app-utils'
import { BigNumber } from 'bignumber.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'

import { type PortfolioSumrStakingV2Data } from '@/app/server-handlers/raw-calls/sumr-staking-v2/types'
import {
  allLockedSumrPositionsTableColumns,
  lockPeriodAllocationTableColumns,
  yourLockedSumrPositionsTableColumns,
} from '@/components/molecules/LockedSumrInfoTabBarV2/constants'
import { LockPeriodCell } from '@/components/molecules/LockedSumrInfoTabBarV2/LockPeriodCell'
import { RemoveStakeModalButton } from '@/components/molecules/LockedSumrInfoTabBarV2/RemoveStakeModalButton'
import {
  type AllLockedSumrPositionsTableColumns,
  type LockedSumrPositionsTableColumns,
  type LockPeriodAllocationTableColumns,
} from '@/components/molecules/LockedSumrInfoTabBarV2/types'
import { MAX_MULTIPLE } from '@/constants/sumr-staking-v2'
import { SUMR_DECIMALS } from '@/features/bridge/constants/decimals'
import { formatStakeLockupPeriod } from '@/helpers/format-stake-lockup-period'

import lockedSumrInfoTabBarV2Styles from './LockedSumrInfoTabBarV2.module.css'

dayjs.extend(relativeTime)

const formatTimestamp = (timestamp: number): string => {
  const date = dayjs.unix(Number(timestamp))

  return date.format('YYYY-MM-DD')
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
  stakes?: PortfolioSumrStakingV2Data['userStakes']
  isLoading?: boolean
  userBlendedYieldBoost?: number
  userSumrStaked?: number
  totalSumrStaked: number
}) => {
  const shareOfTotalStakedSumr = (
    userSumrStaked && userSumrStaked > 0 && totalSumrStaked > 0
      ? (userSumrStaked / totalSumrStaked) * 100
      : 0
  ).toFixed(2)
  const blendedYieldBoost = userBlendedYieldBoost?.toFixed(2)

  const nextUnlockStake = useMemo(() => {
    const sortedStakes = stakes
      ?.filter((stake) => stake.amount > 0n && stake.lockupPeriod > 0n)
      .sort((a, b) => {
        return Number(a.lockupEndTime - b.lockupEndTime)
      })

    if (!sortedStakes || sortedStakes.length === 0) {
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
            stakes
              ?.filter((stake) => {
                return stake.amount > 0n
              })
              .length.toString()
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
          value: isLoading ? (
            <SkeletonLine height="30px" width="60px" style={{ margin: '5px 0' }} />
          ) : (
            `${blendedYieldBoost}x`
          ),
          valueSize: 'large',
          titleSize: 'medium',
          subValue: isLoading ? (
            <SkeletonLine height="14px" width="150px" style={{ margin: '3px 0' }} />
          ) : (
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
              Max boost: {MAX_MULTIPLE}x
            </div>
          ),
        }}
        cardVariant="cardPrimary"
      />
      <DataModule
        dataBlock={{
          title: 'Share of all staked SUMR',
          value: isLoading ? (
            <SkeletonLine height="30px" width="60px" style={{ margin: '5px 0' }} />
          ) : (
            `${shareOfTotalStakedSumr}%`
          ),
          valueSize: 'large',
          titleSize: 'medium',
          subValue: isLoading ? (
            <SkeletonLine height="14px" width="80px" style={{ margin: '3px 0' }} />
          ) : (
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
  stakes?: PortfolioSumrStakingV2Data['userStakes']
  isLoading?: boolean
  userWalletAddress?: string
  refetchStakingData: () => Promise<void>
  penaltyPercentages?: { value: number; index: number }[]
  penaltyAmounts?: { value: number; index: number }[]
  earningsEstimation?: PortfolioSumrStakingV2Data['yourEarningsEstimation']
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

  const rowsData: TableRow<LockedSumrPositionsTableColumns>[] | undefined = stakes
    ?.filter((stake) => stake.amount > 0n)
    .map((stake) => {
      // Find the corresponding penalty data by stake index
      const penaltyPercentage = penaltyPercentages?.find((p) => p.index === stake.index)?.value ?? 0
      const penaltyAmount = penaltyAmounts?.find((p) => p.index === stake.index)?.value ?? 0n

      // Find the corresponding earnings data by stake index (array index matches stake index)
      const stakeEarnings = earningsEstimation?.stakes[stake.index]
      const sumrRewards = stakeEarnings?.sumrRewardsAmount ?? 0n
      const usdEarnings = stakeEarnings?.usdEarningsAmount ?? '0'

      // Format penalty: "23,232 (12%) SUMR"
      const penaltyAmountFormatted = new BigNumber(penaltyAmount.toString()).shiftedBy(
        -SUMR_DECIMALS,
      )
      const penaltyPercentageFormatted = penaltyPercentage.toFixed(2)
      const isNoPenalty = penaltyAmountFormatted.isZero()
      const penaltyDisplay = isNoPenalty
        ? 'No penalty'
        : `${formatCryptoBalance(penaltyAmountFormatted)} (${penaltyPercentageFormatted}%) SUMR`

      // Format rewards: convert from wei
      const sumrRewardsFormatted = new BigNumber(sumrRewards.toString()).shiftedBy(-SUMR_DECIMALS)
      const rewardsDisplay = `${formatCryptoBalance(sumrRewardsFormatted)} (${stake.multiplier.toFixed(2)}x)`

      // Format USD earnings: simple dollar value
      const usdEarningsFormatted = new BigNumber(usdEarnings)
      const usdEarningsDisplay = `$${formatCryptoBalance(usdEarningsFormatted)} (${stake.multiplier.toFixed(2)}x)`

      const isUnlocked =
        Number(stake.lockupPeriod) !== 0 &&
        dayjs.unix(Number(stake.lockupEndTime)).isBefore(dayjs())

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
          lockPeriod: (
            <LockPeriodCell lockupEndTime={stake.lockupEndTime} lockupPeriod={stake.lockupPeriod} />
          ),
          rewards: <TableCenterCell>{rewardsDisplay}</TableCenterCell>,
          usdEarnings: <TableCenterCell>{usdEarningsDisplay}</TableCenterCell>,
          removeStakePenalty: (
            <TableRightCell>
              <Text
                variant="p4semi"
                style={{
                  color:
                    isUnlocked || isNoPenalty
                      ? 'var(--color-text-success)'
                      : 'var(--color-text-critical)',
                }}
              >
                {!isUnlocked ? penaltyDisplay : 'Unlocked'}
              </Text>
            </TableRightCell>
          ),
          action: (
            <TableCenterCell>
              <RemoveStakeModalButton
                userWalletAddress={userWalletAddress}
                amount={stake.amount}
                userStakeIndex={stake.index}
                refetchStakingData={refetchStakingData}
                penaltyPercentage={penaltyPercentage}
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
        rows={rowsData ?? []}
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
  stakes?: PortfolioSumrStakingV2Data['userStakes']
  isLoading?: boolean
  userWalletAddress?: string
  refetchStakingData: () => Promise<void>
  penaltyPercentages?: { value: number; index: number }[]
  penaltyAmounts?: { value: number; index: number }[]
  earningsEstimation?: PortfolioSumrStakingV2Data['yourEarningsEstimation']
  userBlendedYieldBoost?: number
  userSumrStaked?: number
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

interface AllLockedSumrPositionsCardsProps {
  averageLockDuration: number
  totalSumrStaked: number
  circulatingSupply: number
  isLoading?: boolean
}

const AllLockedSumrPositionsCards: FC<AllLockedSumrPositionsCardsProps> = ({
  averageLockDuration,
  totalSumrStaked,
  circulatingSupply,
  isLoading,
}) => {
  // Format average lock duration
  const averageLockPeriodDisplay = formatStakeLockupPeriod(averageLockDuration)

  // Format total SUMR staked
  const totalSumrStakedDisplay = `${formatCryptoBalance(totalSumrStaked)} SUMR`
  // Calculate percentage of circulating supply staked
  const percentStaked = circulatingSupply > 0 ? (totalSumrStaked / circulatingSupply) * 100 : 0
  const percentStakedDisplay = `${percentStaked.toFixed(1)}%`

  return (
    <div className={lockedSumrInfoTabBarV2Styles.lockedSumrPositionsCardsWrapper}>
      <DataModule
        dataBlock={{
          title: 'Avg. SUMR Lock Period',
          value: isLoading ? (
            <SkeletonLine height="30px" width="120px" style={{ margin: '5px 0' }} />
          ) : (
            averageLockPeriodDisplay
          ),
          valueSize: 'large',
          titleSize: 'medium',
        }}
        cardVariant="cardPrimary"
      />
      <DataModule
        dataBlock={{
          title: 'Total SUMR Staked',
          value: isLoading ? (
            <SkeletonLine height="30px" width="150px" style={{ margin: '5px 0' }} />
          ) : (
            totalSumrStakedDisplay
          ),
          valueSize: 'large',
          titleSize: 'medium',
        }}
        cardVariant="cardPrimary"
      />
      <DataModule
        dataBlock={{
          title: '% of circulating SUMR supply Staked',
          value: isLoading ? (
            <SkeletonLine height="30px" width="80px" style={{ margin: '5px 0' }} />
          ) : (
            percentStakedDisplay
          ),
          valueSize: 'large',
          titleSize: 'medium',
        }}
        cardVariant="cardPrimary"
      />
    </div>
  )
}

interface AllLockedSumrPositionsTableProps {
  stakes?: PortfolioSumrStakingV2Data['allStakes']
  isLoading?: boolean
  totalSumrStaked: number
  // earningsEstimation: StakingEarningsEstimationForStakesV2 | null
}

const AllLockedSumrPositionsTable: FC<AllLockedSumrPositionsTableProps> = ({
  stakes,
  isLoading,
  totalSumrStaked,
  // earningsEstimation,
}) => {
  const [sortConfig, setSortConfig] = useState<
    TableSortedColumn<AllLockedSumrPositionsTableColumns>
  >({
    direction: SortDirection.DESC,
    key: 'staked',
  })

  if (isLoading) {
    return (
      <div className={lockedSumrInfoTabBarV2Styles.tableResponsiveWrapper}>
        <Table<AllLockedSumrPositionsTableColumns>
          columns={allLockedSumrPositionsTableColumns}
          rows={Array(4).fill({
            content: {
              staked: <SkeletonLine height="20px" width="80px" />,
              shareOfSumrStaked: (
                <SkeletonLine height="20px" width="50px" style={{ marginLeft: 'auto' }} />
              ),
              stakeTime: <SkeletonLine height="20px" width="50px" style={{ marginLeft: 'auto' }} />,
              stakeExpiring: (
                <SkeletonLine height="20px" width="80px" style={{ marginLeft: 'auto' }} />
              ),
              ownerAddress: (
                <SkeletonLine height="20px" width="80px" style={{ marginLeft: 'auto' }} />
              ),
              usdValueEarningInLazySummer: (
                <SkeletonLine height="20px" width="100px" style={{ marginLeft: 'auto' }} />
              ),
            },
          })}
        />
      </div>
    )
  }

  const rowsData: TableRow<AllLockedSumrPositionsTableColumns>[] | undefined = stakes
    ?.filter((stake) => stake.amount > 0n)
    .sort((a, b) => {
      const aAmountValue = new BigNumber(a.amount.toString()).shiftedBy(-SUMR_DECIMALS).toNumber()
      const bAmountValue = new BigNumber(b.amount.toString()).shiftedBy(-SUMR_DECIMALS).toNumber()
      const aLockupValue = new BigNumber(a.lockupPeriod.toString()).toNumber()
      const bLockupValue = new BigNumber(b.lockupPeriod.toString()).toNumber()

      switch (sortConfig.key) {
        case 'staked':
          return sortConfig.direction === SortDirection.ASC
            ? aAmountValue - bAmountValue
            : bAmountValue - aAmountValue

        case 'stakeTime':
          return sortConfig.direction === SortDirection.ASC
            ? aLockupValue - bLockupValue
            : bLockupValue - aLockupValue
      }

      return 0
    })
    .map((stake) => {
      // Format staked amount
      const stakedAmount = new BigNumber(stake.amount.toString()).shiftedBy(-SUMR_DECIMALS)
      const stakedDisplay = `${formatCryptoBalance(stakedAmount)} SUMR`

      // Calculate share of total staked
      const shareOfStaked =
        totalSumrStaked > 0 ? (stakedAmount.toNumber() / totalSumrStaked) * 100 : 0
      const shareDisplay = `${shareOfStaked.toFixed(2)}%`

      // Format lock period
      const lockPeriodDisplay = formatStakeLockupPeriod(stake.lockupPeriod)

      // Format owner address
      const ownerDisplay = `${stake.owner.slice(0, 6)}...${stake.owner.slice(-4)}`

      // Find the corresponding earnings data by stake index (array index matches stake index)
      const allStakesIndex = stakes.findIndex((s) => s.id === stake.id)

      if (allStakesIndex === -1) {
        throw new Error('Earnings data not found for stake, should not happen')
      }
      // const stakeEarnings = earningsEstimation?.stakes[allStakesIndex]
      // const usdEarnings = stakeEarnings?.usdEarningsAmount ?? null

      // Format USD earnings: simple dollar value, or dash if not available
      // const usdEarningsDisplay =
      //   usdEarnings !== null ? `$${formatCryptoBalance(new BigNumber(usdEarnings))}` : '-'

      // Format stake expiring
      const stakeExpiringDisplay = dayjs.unix(Number(stake.lockupEndTime)).format('MMM D, YYYY')

      return {
        id: `${stake.owner}-${stake.index}`,
        content: {
          staked: stakedDisplay,
          shareOfSumrStaked: <TableRightCell>{shareDisplay}</TableRightCell>,
          stakeTime: <TableRightCell>{lockPeriodDisplay}</TableRightCell>,
          stakeExpiring: <TableRightCell>{stakeExpiringDisplay}</TableRightCell>,
          ownerAddress: <TableRightCell>{ownerDisplay}</TableRightCell>,
          // usdValueEarningInLazySummer: <TableRightCell>{usdEarningsDisplay}</TableRightCell>,
        },
      }
    })

  return (
    <div className={lockedSumrInfoTabBarV2Styles.tableResponsiveWrapper}>
      <Table<AllLockedSumrPositionsTableColumns>
        columns={allLockedSumrPositionsTableColumns}
        rows={rowsData ?? []}
        handleSort={(config) => {
          setSortConfig({ key: config.key, direction: config.direction })
        }}
      />
    </div>
  )
}

interface AllLockedSumrPositionsDataProps {
  stakes?: PortfolioSumrStakingV2Data['allStakes']
  isLoading?: boolean
  totalSumrStaked: number
  bucketInfo: PortfolioSumrStakingV2Data['bucketInfo']
  isLoadingBucketInfo?: boolean
  // earningsEstimation: StakingEarningsEstimationForStakesV2 | null
}

const AllLockedSumrPositionsData: FC<AllLockedSumrPositionsDataProps> = ({
  stakes,
  isLoading,
  totalSumrStaked,
  bucketInfo,
  isLoadingBucketInfo,
  // earningsEstimation,
}) => {
  // Calculate allocation percentages from bucket data
  const allocation: {
    label: string
    percentage: number
    color: string
    tooltip?: ReactNode
    cap?: number
  }[] = useMemo(() => {
    const COLORS = ['#ff80bf', '#fa52a6', '#fa3d9b', '#ff1a8c', '#cc0066', '#99004d']

    if (isLoadingBucketInfo ?? bucketInfo.length === 0) {
      return [
        { label: 'No lockup', percentage: 0, color: COLORS[0] },
        { label: '2 weeks - 3 months', percentage: 0, color: COLORS[1] },
        { label: '3 months - 6 months', percentage: 0, color: COLORS[2] },
        { label: '6 months - 1 year', percentage: 0, color: COLORS[3] },
        { label: '1 year - 2 years', percentage: 0, color: COLORS[4] },
        { label: 'More than 2 years', percentage: 0, color: COLORS[5] },
      ]
    }

    // Find buckets by their enum values (2-6)
    const bucket1 = bucketInfo.find((b) => b.bucket === 0) // NoLockup, actually 0 not 1
    const bucket2 = bucketInfo.find((b) => b.bucket === 2) // TwoWeeksToThreeMonths
    const bucket3 = bucketInfo.find((b) => b.bucket === 3) // ThreeToSixMonths
    const bucket4 = bucketInfo.find((b) => b.bucket === 4) // SixToTwelveMonths
    const bucket5 = bucketInfo.find((b) => b.bucket === 5) // OneToTwoYears
    const bucket6 = bucketInfo.find((b) => b.bucket === 6) // TwoToThreeYears

    // Calculate total staked across these buckets
    const totalBucketStaked = [
      bucket1?.totalStaked ? BigInt(bucket1.totalStaked) : 0n,
      bucket2?.totalStaked ? BigInt(bucket2.totalStaked) : 0n,
      bucket3?.totalStaked ? BigInt(bucket3.totalStaked) : 0n,
      bucket4?.totalStaked ? BigInt(bucket4.totalStaked) : 0n,
      bucket5?.totalStaked ? BigInt(bucket5.totalStaked) : 0n,
      bucket6?.totalStaked ? BigInt(bucket6.totalStaked) : 0n,
    ].reduce((sum, amount) => sum + amount, 0n)

    const totalBucketStakedNumber = Number(totalBucketStaked) / 1e18

    // Calculate percentage for each bucket
    const calculatePercentage = (amount: number | undefined) => {
      if (!amount || totalBucketStakedNumber === 0) return 0

      return Number(amount) / 1e18 / totalBucketStakedNumber
    }

    return [
      {
        label: 'No lockup',
        percentage: calculatePercentage(bucket1?.totalStaked),
        color: COLORS[0],
        cap: Number(bucket1?.cap ?? 0) / 1e18,
      },
      {
        label: '2 weeks - 3 months',
        percentage: calculatePercentage(bucket2?.totalStaked),
        color: COLORS[1],
        cap: Number(bucket2?.cap ?? 0) / 1e18,
      },
      {
        label: '3 months - 6 months',
        percentage: calculatePercentage(bucket3?.totalStaked),
        color: COLORS[2],
        cap: Number(bucket3?.cap ?? 0) / 1e18,
      },
      {
        label: '6 months - 1 year',
        percentage: calculatePercentage(bucket4?.totalStaked),
        color: COLORS[3],
        cap: Number(bucket4?.cap ?? 0) / 1e18,
      },
      {
        label: '1 year - 2 years',
        percentage: calculatePercentage(bucket5?.totalStaked),
        color: COLORS[4],
        cap: Number(bucket5?.cap ?? 0) / 1e18,
      },
      {
        label: 'More than 2 years',
        percentage: calculatePercentage(bucket6?.totalStaked),
        color: COLORS[5],
        cap: Number(bucket6?.cap ?? 0) / 1e18,
      },
    ]
  }, [bucketInfo, isLoadingBucketInfo])

  return (
    <div
      className={clsx(
        lockedSumrInfoTabBarV2Styles.wrapper,
        lockedSumrInfoTabBarV2Styles.allLockedSumrPositionsDataWrapper,
      )}
    >
      <Text variant="h5">SUMR Lock Period Allocation</Text>
      {isLoadingBucketInfo ? (
        <SkeletonLine height="40px" width="100%" style={{ margin: '8px 0' }} />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          <AllocationBar items={allocation} variant="large" />
          <div>
            <Table<LockPeriodAllocationTableColumns>
              columns={lockPeriodAllocationTableColumns}
              rows={allocation.map((item) => ({
                id: `lock-period-${item.label}`,
                content: {
                  bucket: item.label,
                  cap: <TableRightCell>{formatCryptoBalance(item.cap ?? 0)}</TableRightCell>,
                  staked: (
                    <TableRightCell>
                      {formatCryptoBalance(item.percentage * totalSumrStaked)} SUMR
                    </TableRightCell>
                  ),
                  percentage: (
                    <TableRightCell>{formatDecimalAsPercent(item.percentage)}</TableRightCell>
                  ),
                },
              }))}
            />
          </div>
        </div>
      )}
      <Text variant="h5">All Locked SUMR Positions</Text>
      <AllLockedSumrPositionsTable
        stakes={stakes}
        isLoading={isLoading}
        totalSumrStaked={totalSumrStaked}
        // earningsEstimation={earningsEstimation}
      />
    </div>
  )
}

interface AllLockedSumrPositionsProps {
  stakes?: PortfolioSumrStakingV2Data['allStakes']
  isLoading?: boolean
  totalSumrStaked: number
  averageLockDuration: number
  circulatingSupply: number
  bucketInfo: PortfolioSumrStakingV2Data['bucketInfo']
  isLoadingBucketInfo?: boolean
  // earningsEstimation: StakingEarningsEstimationForStakesV2 | null
}

const AllLockedSumrPositions: FC<AllLockedSumrPositionsProps> = ({
  stakes,
  isLoading,
  totalSumrStaked,
  averageLockDuration,
  circulatingSupply,
  bucketInfo,
  isLoadingBucketInfo,
  // earningsEstimation,
}) => {
  return (
    <div className={lockedSumrInfoTabBarV2Styles.wrapper}>
      <AllLockedSumrPositionsCards
        averageLockDuration={averageLockDuration}
        totalSumrStaked={totalSumrStaked}
        circulatingSupply={circulatingSupply}
        isLoading={isLoading}
      />
      <AllLockedSumrPositionsData
        stakes={stakes}
        isLoading={isLoading}
        totalSumrStaked={totalSumrStaked}
        bucketInfo={bucketInfo}
        isLoadingBucketInfo={isLoadingBucketInfo}
        // earningsEstimation={earningsEstimation}
      />
    </div>
  )
}

interface LockedSumrInfoTabBarV2Props {
  stakes?: PortfolioSumrStakingV2Data['userStakes']
  isLoading?: boolean
  userWalletAddress?: string
  refetchStakingData: () => Promise<void>
  penaltyPercentages?: { value: number; index: number }[]
  penaltyAmounts?: { value: number; index: number }[]
  yourEarningsEstimation?: PortfolioSumrStakingV2Data['yourEarningsEstimation']
  userBlendedYieldBoost?: number
  userSumrStaked?: number
  totalSumrStaked: number
  allStakes?: PortfolioSumrStakingV2Data['allStakes']
  isLoadingAllStakes?: boolean
  averageLockDuration: number
  circulatingSupply: number
  bucketInfo: PortfolioSumrStakingV2Data['bucketInfo']
  isLoadingBucketInfo?: boolean
}

export const LockedSumrInfoTabBarV2: FC<LockedSumrInfoTabBarV2Props> = ({
  stakes,
  isLoading = false,
  userWalletAddress,
  refetchStakingData,
  penaltyPercentages,
  penaltyAmounts,
  yourEarningsEstimation,
  // allEarningsEstimation,
  userBlendedYieldBoost,
  userSumrStaked,
  totalSumrStaked,
  allStakes,
  isLoadingAllStakes,
  averageLockDuration,
  circulatingSupply,
  bucketInfo,
  isLoadingBucketInfo,
}) => {
  const tabs = []

  // Only show "Your Locked SUMR Positions" tab if wallet is connected
  if (userWalletAddress) {
    tabs.push({
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
          earningsEstimation={yourEarningsEstimation}
          userBlendedYieldBoost={userBlendedYieldBoost}
          userSumrStaked={userSumrStaked}
          totalSumrStaked={totalSumrStaked}
        />
      ) : stakes?.length ? (
        <YourLockedSumrPositions
          stakes={stakes}
          userWalletAddress={userWalletAddress}
          refetchStakingData={refetchStakingData}
          penaltyPercentages={penaltyPercentages}
          penaltyAmounts={penaltyAmounts}
          earningsEstimation={yourEarningsEstimation}
          userBlendedYieldBoost={userBlendedYieldBoost}
          userSumrStaked={userSumrStaked}
          totalSumrStaked={totalSumrStaked}
        />
      ) : (
        <NoStakedPositions />
      ),
    })
  }

  // Always show "All Locked SUMR Positions" tab
  tabs.push({
    id: 'all-locked-sumr-positions',
    label: 'All Locked SUMR Positions',
    content: (
      <AllLockedSumrPositions
        stakes={allStakes}
        isLoading={isLoadingAllStakes}
        totalSumrStaked={totalSumrStaked}
        averageLockDuration={averageLockDuration}
        circulatingSupply={circulatingSupply}
        bucketInfo={bucketInfo}
        isLoadingBucketInfo={isLoadingBucketInfo}
        // earningsEstimation={allEarningsEstimation}
      />
    ),
  })

  return (
    <div className={lockedSumrInfoTabBarV2Styles.wrapper}>
      <TabBar tabs={tabs} />
    </div>
  )
}
