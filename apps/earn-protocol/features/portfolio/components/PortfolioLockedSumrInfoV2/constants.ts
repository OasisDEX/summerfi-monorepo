import {
  type AllLockedSumrPositionsTableColumns,
  type LockedSumrPositionsTableColumns,
} from '@/features/portfolio/components/PortfolioLockedSumrInfoV2/types'

export const yourLockedSumrPositionsTableColumns: {
  title: string
  key: LockedSumrPositionsTableColumns
}[] = [
  {
    title: 'SUMR Stake Position',
    key: 'position',
  },
  {
    title: 'SUMR Staked',
    key: 'staked',
  },
  {
    title: 'SUMR Stake lock period',
    key: 'lockPeriod',
  },
  {
    title: 'SUMR Rewards (1 yr)',
    key: 'rewards',
  },
  {
    title: 'USD Earnings (1 yr)',
    key: 'usdEarnings',
  },
  {
    title: 'Remove stake penalty',
    key: 'removeStakePenalty',
  },
  {
    title: 'Actions',
    key: 'action',
  },
]

export const allLockedSumrPositionsTableColumns: {
  title: string
  key: AllLockedSumrPositionsTableColumns
}[] = [
  {
    title: 'SUMR Staked',
    key: 'staked',
  },
  { title: 'Share of SUMR Staked / Supply', key: 'shareOfSumrStaked' },
  {
    title: 'SUMR Stake Time',
    key: 'stakeTime',
  },
  {
    title: 'Owner address',
    key: 'ownerAddress',
  },
  {
    title: 'USD Value earning in Lazy Summer',
    key: 'usdValueEarningInLazySummer',
  },
]
