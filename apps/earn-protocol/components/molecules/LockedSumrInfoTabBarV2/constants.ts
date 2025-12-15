import {
  type AllLockedSumrPositionsTableColumns,
  type LockedSumrPositionsTableColumns,
  type LockPeriodAllocationTableColumns,
} from '@/components/molecules/LockedSumrInfoTabBarV2/types'

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
  sortable?: boolean
}[] = [
  {
    title: 'SUMR Staked',
    key: 'staked',
    sortable: true,
  },
  { title: 'Share of SUMR Staked / Supply', key: 'shareOfSumrStaked' },
  {
    title: 'SUMR Stake Time',
    key: 'stakeTime',
    sortable: true,
  },
  {
    title: 'Stake Expiring',
    key: 'stakeExpiring',
  },
  {
    title: 'Owner address',
    key: 'ownerAddress',
  },
  // {
  //   title: 'USD Earnings (1 yr)',
  //   key: 'usdValueEarningInLazySummer',
  // },
]

export const lockPeriodAllocationTableColumns: {
  title: string
  key: LockPeriodAllocationTableColumns
  sortable?: boolean
}[] = [
  { key: 'bucket', title: 'Bucket' },
  {
    key: 'cap',
    title: 'Cap (SUMR)',
  },
  {
    key: 'staked',
    title: 'Staked',
  },
  {
    key: 'percentage',
    title: '% of all Staked SUMR',
  },
]
